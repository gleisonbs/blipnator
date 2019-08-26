function trackings() {
    let getByName = (name, parameters) => {
        const mappings = {
            exibicao: {
                "type": "TrackEvent",
                "$title": "Registro de eventos - Exibicao",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": parameters.name,
                    "action": "Exibicao"
                }
            },
            origem: {
                "type": "TrackEvent",
                "$title": "Registro de eventos - Origem",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": parameters.name + " - origem",
                    "action": "{{lastState}}"
                }
            },
            conteudo: {
                "type": "TrackEvent",
                "$title": "Registro de eventos - Conteudo",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": parameters.name + " - conteudo",
                    "action": "{{inputContentSubstring}}"
                }
            },
            cliques: {
                "type": "TrackEvent",
                "$title": "Registro de eventos - Cliques",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": parameters.name + " - cliques",
                    "action": "{{chooseAnswer}}"
                }
            },
            userid: {
                "type": "TrackEvent",
                "$title": "Registro de eventos - UserId",
                "$invalid": false,
                "settings": {
                    "extras": {
                        "userId": "{{contact.identity}}",
                        "originatorMessageId": "{{input.message@id}}",
                        "userEmail": "{{contact.email}}",
                        "userName": "{{contact.name}}",
                        "sessionId": "{{sessionId}}"
                    },
                    "category": parameters.name + " - userid",
                    "action": "{{contact.identity}}"
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