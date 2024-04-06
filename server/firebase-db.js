"use strict";
import {initializeApp} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Database } from './object-base.js';
import * as fs from 'fs';
import * as path from 'path';
import { isValidEvent } from "./validator.js";
import { applicationDefault } from "firebase-admin/app";

// ================ FIREBASE SETTINGS =============================

// URL of the firebase app
const url = process.env.FIREBASE_URL;

const firebaseApp = initializeApp({
  credential : applicationDefault(),
  databaseURL : url
});

// Get the default Firestore database for this project
const store = getFirestore(firebaseApp);

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
    
    if(typeof newEventJSON === 'string')
    {
      newEventJSON = JSON.parse(newEventJSON);
    } 
    
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
    console.log("Logged new event! of type: " + newEventJSON['event-type']);

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
      console.log("Event cache is empty or undefined!");
      return;
    }

    let writeBatch = store.batch();
    // Create batch to send to the database
    for(const newEvent of eventCache)
    {
      console.log(newEvent['event-type']);
      let colRef = store.collection(`events/${newEvent['event-type']}/event-list`);
      writeBatch.create(colRef.doc(), newEvent);
    }
    
    // Batch write to the database, clearing the cache afterwards
    writeBatch.commit().then(async (ref)=>
    {
      eventCache = [];
      console.log("Sent event cache to database!");
    });

  }
}