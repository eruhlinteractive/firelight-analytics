"use strict";
import { initializeApp } from "firebase-admin/app";
import {getFirestore } from 'firebase-admin/firestore';
import admin from "firebase-admin";
import { Database } from './object-base.js';
import * as fs from 'fs';
import * as path from 'path';
import { isValidEvent } from "./validator.js";

// ================ FIREBASE SETTINGS =============================

// The path to the service auth file (relative to the location of server.js)
const firebaseAuthLocation = process.env.FIREBASE_AUTH_LOCATION;

const authPath = path.join(process.cwd(), firebaseAuthLocation);

const serviceAccountAuth = JSON.parse(fs.readFileSync(authPath));

const firebaseApp = initializeApp({

  credential: admin.credential.cert(serviceAccountAuth)

});

// Get the default Firestore database for this project
const store = getFirestore();


// Class to handle Firestore database transactions admin
export class FireStoreDB extends Database
{

  constructor(jsonConfig){
    super();

    try
    {
      this.maxEventsToCache = jsonConfig["maxEventsToCache"];
    }
    catch(err)
    {
      this.maxEventsToCache = process.env.EVENT_CACHE_MAX | 1;
    }

    this.eventCache = [];
  };

  // Log a new event
  async logEvent(newEventJSON)
  {
    //const docRef = doc(store, 'events', newEventJSON["event-type"]);

    // Timestamp and validate event
    newEventJSON["timestamp"] = Date.now();

    // Returns a JSON object in the format {isValid: bool, errors:[string]}
    let validationResult = isValidEvent(newEventJSON);

    if(!validationResult.isValid)
    {
      console.log("Invalid event received: " + validationResult.errors.join(","));
      return;
    }

    this.eventCache.push(newEventJSON);
    console.log("Logged new event!");

    // Send cached events to the database if we've exceeded the cache limits
    if(this.eventCache.length >= this.maxEventsToCache - 1)
    {
      console.log("Sending cached events")

      // Create a deep copy of the json events
      let cachedEvents = JSON.parse(JSON.stringify(this.eventCache));

      console.log(cachedEvents);
      // Clear the event cache
      this.eventCache = [];

      // Wait for the batch commit to be started before 
      this.sendCachedEvents(cachedEvents);
    }
    //console.log("Created doc with ref " + ref);
  }

  // Send a cache of validated events to the database (batch operation)
  async sendCachedEvents(eventCache)
  {
    // Don't try to send an undefined or empty event cache
    if(eventCache == undefined | eventCache.length == 0)
    {
      return;
    }

    let writeBatch = store.batch();
    // Create batch to send to the database
    for(const newEvent of eventCache)
    {
      let colRef = store.collection(`events/${newEvent['event-type']}/event-list`);
      writeBatch.create(colRef.doc(), newEvent);
    }
    
    // Batch write to the database, clearing the cache afterwards
    writeBatch.commit().then(async (ref)=>
    {
      eventCache = [];
    });

  }
}