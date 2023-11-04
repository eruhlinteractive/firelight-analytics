import { initializeApp } from "firebase-admin/app";
import {getFirestore } from 'firebase-admin/firestore';

import admin from "firebase-admin";

import { Database } from './object-base.js';

import * as fs from 'fs';
import * as path from 'path';

// ================ FIREBASE SETTINGS =============================

// The path to the service auth file (relative to the location of server.js)
const firebaseAuthLocation = process.env.FIREBASE_AUTH_LOCATION;

const authPath = path.join(process.cwd(), firebaseAuthLocation);

const serviceAccountAuth = JSON.parse(fs.readFileSync(authPath));
// Initialize Firebase


const firebaseApp = initializeApp({

  credential: admin.credential.cert(serviceAccountAuth)

});

const store = getFirestore();


// Class to handle Firestore database transactionsadmin
export class FireStoreDB extends Database
{
  constructor(){
    super();
  };


  async sendEvent(newEventJSON)
  {
    //const docRef = doc(store, 'events', newEventJSON["event-type"]);

    store.collection(`events/${newEventJSON['event-type']}/event-list`).add(newEventJSON)
    .then(async (ref)=>
    {
      let res = await ref;
      console.log(res);
    })
    //console.log("Created doc with ref " + ref);
  }

}