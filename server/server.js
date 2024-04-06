//const fetch = require('node-fetch');
import 'dotenv/config';
import { FireStoreDB } from './firebase-db.js';

import express, { json } from 'express';
import cors from 'cors';

// ================ SERVER SETTINGS =============================
// The port to listen on
const port = process.env.PORT


// Handler for incoming requests (from clients)
const app = express();

const db = new FireStoreDB();

// Allows the body data to be parsed as JSON
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGIN }));

// Rate limiter
//const limiter = rateLimit({
//	windowMs: 5 * 60 * 1000, // 5 minutes
//	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//})

// Use the rate limiter
//app.use(limiter)

// ================ APP ROUTING ================================

app.listen(port, ()=>
{
    console.log(`Started firelight analytics on port ${port}`);
});

// Sends a basic response to check if the server is alive
app.get('/ping', (req, res)=>{
    // I'm a little teapot short and stout
    console.log(req);
    res.sendStatus(418);
});

// Handle the logging of a new event from a client
app.post('/log-event', (req, res)=>{
    let bodyData = req.body;

    let event = bodyData["event"];
    try
    {
        // Send the event to the database
        db.logEvent(event);
    }
    catch(e)
    {
        console.log("WARN: Failed to log event");
        console.log(e);
    }
    finally
    {
        res.sendStatus(201);
    }
});

// Handle request to load dashboard
app.get('/dashboard', (req, res)=>
{   
    // TODO
    res.sendStatus(404);
});