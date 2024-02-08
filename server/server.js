//const fetch = require('node-fetch');
import 'dotenv/config';
import { FireStoreDB } from './firebase-db.js';

import express from 'express';

// ================ SERVER SETTINGS =============================
// The port to listen on
const port = process.env.PORT

// How many should we cache before sending to the database?
//  If set to 1, each request will be sent as a separate transaction to the database
const maxCachedEvents = process.env.EVENT_CACHE_MAX | 1


// Handler for incoming requests (from clients)
const app = express();

const db = new FireStoreDB();

// Allows the body data to be parsed as JSON
app.use(express.json());

// ================ APP ROUTING ================================

app.listen(port, ()=>
{
    console.log(`Started firelight analytics on port ${port}`);
});


//db.logEvent({"event-type": "page-view", "data": {}});
//db.logEvent({"event-type": "button-click", "data": {"details": "This is a batch write of a button click"}});

// Sends a basic response to check if the server is alive
app.get('/ping', (req, res)=>{
    // I'm a little teapot short and stout
    res.sendStatus(418);
});

// Handle the logging of a new event from a client
app.post('/log-event', (req, res)=>{
    let bodyData = req.body;

    let event = bodyData["event"];
    
    // Send the event to the dashboard
    let dbResponseCode = db.logEvent(event);

    res.sendStatus(201);
});

// Handle request to load dashboard
app.get('/dashboard', (req, res)=>
{   
    // TODO
    res.sendStatus(404);
});