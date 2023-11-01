

export class TrackedEvent
{

    // Members 
    eventID = "";

    constructor(eventID){
        this.eventID = eventID;
    }
    
    getDataAsJSON()
    {
        console.error('The event is not to be used on its own!')
        return {};
    }

    validate(jsonObject)
    {
        return this.eventID !== "" && this.eventID !== undefined;
    }
};

