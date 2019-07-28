function trackings() {
    let getByName = (name, parameters) => {
        const mappings = {
            laststate: {
                "type": "TrackEvent",
                "$title": "Registro de eventos Last State",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": "Menu cliente origem",
                    "action": "{{lastState}}"
                }
            }
        }
        
        return mappings[name];
    }

    return {
        getByName
    }
}

module.exports = trackings