export class Database
{
    // How many events we should cache before committing a transaction to the database
    maxEventsToCache = 1;

    // The currently cached events
    eventCache = [];
    constructor(){};

    // Send an event, optionally caching it for later
    async logEvent(newEventJSON){};
    

    // Send a cache of validated events to the database (batch operation)
    async sendCachedEvents(eventCache){};

}