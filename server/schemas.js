import { TrackedEvent } from "./object-base";


// Creates empty schemas for validation or population
function emptySchemaFactory(schemaName)
{
    // TODO: Properly sanitize this 
    let sanitized = schemaName.toLowerCase().trim();

    switch(sanitized)
    {
        case "page-view":
            return PageView(sanitized);
        
        // TODO: Add additional cases for your schemas
    }
        
}

function timestampEvent(eventJSON)
{
    //eventJSON.timestamp
    return eventJSON;
}

function validateEvent(eventJSON)
{
    

    return eventJSON;
}

// TODO: Define your schemas here
class PageView extends TrackedEvent
{
    // The referrer of the page
    referrer = "";

    // The path of the page (excluding the domain)
    path = "";

    // Validate the object,
    validate(jsonObject)
    {
        let isValid = true;

        isValid = super(jsonObject);
        isValid = jsonObject.referrer !== "" && jsonObject.referrer !== undefined;;
        isValid = jsonObject.path !== "" && jsonObject.path !== undefined;
    }
}