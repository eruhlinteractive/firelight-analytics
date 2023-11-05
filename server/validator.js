import Ajv from 'ajv';

// See documentation at https://ajv.js.org
const ajvValidator = new Ajv();

// -------- Adding a new schema validation --------
//  1. Define a validation schema (see basicEventSchema)
//  2. Compile the validation function 
//  3. Add an entry in switch of isValidEvent() to map event-type -> validation function
//      3a. Make sure to return the result of passing in the event JSON and validation function to validateAndGenerateErrors() 
//          to ensure the proper return type
//      You can map multiple types to the same function if you would like :)
//  ------------------------------------------------


// Schema for a basic event schema
const basicEventSchema = {
    type: "object",

    properties: {
        'event-type': { type: 'string', minLength: 1},
        'timestamp': {type: 'integer'},
        'data': { type: 'object'}
    },
    required: ['event-type', 'timestamp']
}

// Compile event validation functions for later use
const validateBasicEvent = ajvValidator.compile(basicEventSchema);

// TODO: Compile your custom validator functions 


// Checks if an event is valid based on the event-type
// Returns JSON object in the form {isValid: bool, errors:[string]}, with the errors array containing items if the event is invalid
export function isValidEvent(eventJSON)
{
    switch(eventJSON['event-type'] | "")
    {
        // TODO: Add any cases for validated event types here

        default:
            return validateAndGenerateErrors(eventJSON, validateBasicEvent);
    }

    // Something has gone very wrong D:
    return false;
}

// Run the validationFuncton on the eventJSON, generating the errors as they are found
// Returns JSON object in the form {isValid: bool, errors:[string]}, with the errors array containing items if the event is invalid
function validateAndGenerateErrors(eventJSON, validationFunction)
{
    let isEventValid = validationFunction(eventJSON);

    let validationInfo = {
        isValid : isEventValid
    };

    // If the event is invalid, generate a list of errors ( or a single if short-circuiting on failure)
    if(!isEventValid)
    {
        let errorMessages = validationFunction.errors.map(err => err.message);
        console.log(errorMessages);
        validationInfo['errors'] = errorMessages;
    }
   

    return validationInfo;
}