class FirelightAnalytics
{
    endpoint = undefined;

    constructor(config)
    {
        this.endpoint = config["endpoint"];
    }

    /// Track a new (custom) event
    async trackEvent(eventData)
    {
        let body = {
            "event": eventData
        }
        
        this.sendEvent(body);
    }


    async sendEvent(newEventJSON)
    {
        // Send the new event to the endpoint
        const response = await fetch(this.endpoint,
        {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEventJSON)

        });

        // Something failed
        if(response.status != 201 && response.status != 200)
        {
            console.log("Failed to log event");
        }

    }


    // Track and log a new page view
    async trackPageView()
    {
        let URL = window.location.pathname;
        let windowSize = `${window.innerWidth}x${window.innerHeight}`;
        let referrer = window.referrer;

        let data = {
            "path": URL,
            "windowDimensions": windowSize,
            "ref": referrer
        };

        let payload = {
            "event-type": "page-view",
            "data": data
        };

        this.trackEvent(payload);
    }

}

export {FirelightAnalytics};