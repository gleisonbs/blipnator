function filters() {

    const hasTitleLike = (block, pattern) => block['$title'].includes(pattern)
    const hasTitleEquals = (block, pattern) => block['$title'] === pattern

    const hasTitleNotLike = (block, pattern) => !block['$title'].includes(pattern)
    const hasTitleNotEquals = (block, pattern) => block['$title'] !== pattern

    const hasEnteringActionLike = (block, pattern) => block['$enteringCustomActions'].filter(a => a['$title'].includes(pattern)).length !== 0

    const hasLeavingActionLike = (block, pattern) => block['$leavingCustomActions'].filter(a => a['$title'].includes(pattern)).length !== 0
    
    const hasUserInput = (block, pattern) => block["$contentActions"].filter(a => a["input"] && a["input"]["bypass"] === false).length > 0

    const hasQuickReply = (block, pattern) => block["$inputSuggestions"].length > 0

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
            "title equals": hasTitleEquals,
            "title not like": hasTitleNotLike,
            "title not equals": hasTitleNotEquals,
            "entering action like": hasEnteringActionLike,
            "leaving action like": hasLeavingActionLike,
            "sends message": hasMessageToUser,
            "awaits input": hasUserInput,
            "has quick reply": hasQuickReply
        }
    
        return descriptionToFunctionMapping[description]
    }

    function blockMatchesAll(block, criterias) {
        if (block["id"] === "onboarding")
            return false
            
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