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

    const getByDescription = (description) => {
        const descriptionToFunctionMapping = {
            "title like": hasTitleLike,
            "entering action like": hasEnteringActionLike,
            "leaving action like": hasLeavingActionLike,
            "message to user": hasMessageToUser
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