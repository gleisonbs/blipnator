function filters() {

    const hasTitleLike = (block, pattern) => block['$title'].includes(pattern)
    const hasEnteringActionLike = (block, pattern) => block['$enteringCustomActions'].filter(a => a['$title'].includes(pattern)).length !== 0
    const hasLeavingActionLike = (block, pattern) => block['$leavingCustomActions'].filter(a => a['$title'].includes(pattern)).length !== 0
    const hasMessageToUser = (block, pattern) => {
        for (contentAction of block["$contentActions"]) {
            action = contentAction["action"]
            try {
                const isMessageToUser = action["type"] === "SendMessage" && action["settings"]["type"] === "text/plain"
                const matchPattern = pattern ? action["settings"]["content"].includes(pattern) : true
                if (isMessageToUser && matchPattern)
                    return true
            }
            catch {}
        }
        return false
    }
    const hasUserInput = (block, pattern) => block["$contentActions"].filter(a => a["input"] && !a["input"]["bypass"]).length > 0
    
    const hasTrackings = (block, pattern) => {
        const et = block["$enteringCustomActions"].filter(a => a["type"] === "TrackEvent")
        const lt = block["$leavingCustomActions"].filter(a => a["type"] === "TrackEvent")
        return et.length > 0 || lt.length > 0
    }
    
    const getByDescription = (description) => {
        const descriptionToFunctionMapping = {
            "title contains": hasTitleLike,
            "entering action like": hasEnteringActionLike,
            "leaving action like": hasLeavingActionLike,
            "has message to user": hasMessageToUser,
            "has user input": hasUserInput,
            "has trackings": hasTrackings
        }
    
        return descriptionToFunctionMapping[description]
    }

    function blockMatchesAll(block, criterias) {
        for (criteria of criterias) {
            let filterFunction = getByDescription(criteria.description)
            if (!filterFunction(block, criteria.pattern)) {
                return false
            }
        }
    
        return true
    }

    return {
        getByDescription,
        blockMatchesAll
    }
}

module.exports = filters