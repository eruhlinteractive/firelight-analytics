const fetch = require('node-fetch');
const express = require('express');
const { env } = require('process');

// Initialization

// Handler for incoming requests (from clients)
const app = express();

// Allows the body data to be parsed as JSON
app.use(express.bodyParser());

// The port to listen for incoming requests on
const listenPort = process.env.PORT || 80

// Should we cache events on the server?
const shouldCacheEvents = process.env.CACHE_EVENTS || false

// If we're caching events, how many should we cache before sending to the database?
const maxCachedEvents = process.env.EVENT_CACHE_MAX || 0


// Sends a basic response to check if the server is alive
app.get('/ping', (req, res)=>{
    res.sendStatus(200);
});

// Handle the logging of a new event from a client
app.post('/log-event', (req, res)=>{
    let bodyData = res.body;

    let event = data["event"];
});

// Handle request to load dashboard
app.get('/dashboard', (req, res)=>
{

});