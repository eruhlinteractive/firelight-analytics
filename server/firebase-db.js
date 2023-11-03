import { initializeApp, FirebaseDatabase } from "firebase-admin/app";

import { Database } from './object-base.js';

// ================ FIREBASE SETTINGS =============================

const firebaseAPIKey = process.env.FIREBASE_API_KEY

const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN

const firebaseProjectID = process.env.FIREBASE_PROJECT_ID

const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET

const firebaseMessagingSenderID = process.env.FIREBASE_MESSAGING_SENDER_ID

const firebaseAppID = process.env.FIREBASE_APP_ID


// https://firebase.google.com/docs/web/setup#available-libraries


// Firebase configuration

const firebaseConfig = {

  apiKey: firebaseAPIKey,

  authDomain: firebaseAuthDomain,

  projectId: firebaseProjectID,

  storageBucket: firebaseStorageBucket,

  messagingSenderId: firebaseMessagingSenderID,

  appId: firebaseAppID

};

// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const store = getFirestore(firebaseApp);


// Class to handle Firestore database transactions
export class FireStoreDB extends Database
{
  constructor(){
    super();
  };


  async sendEvent(newEventJSON)
  {
    //const docRef = doc(store, 'events', newEventJSON["event-type"]);

    const ref = await addDoc(
      collection(store, `events/${newEventJSON['event-type']}/event-list`),
      newEventJSON
    );

  }

}