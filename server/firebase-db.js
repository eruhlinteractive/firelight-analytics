import {
    firebaseAPIKey, 
    firebaseAuthDomain, 
    firebaseProjectID,
    firebaseStorageBucket,
    firebaseMessagingSenderID,
    firebaseAppID
} from './parameters'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use

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
const store = getFirestore(firebaseApp)