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
                "$title": "Registro de eventos - Last State",
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
                    "action": "{{input.content}}"
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
            }
        }
        
        return mappings[name];
    }

    return {
        getByName
    }
}

module.exports = trackings