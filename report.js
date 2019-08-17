function report(block, highlight) {
    let hasHighlight = false

    const cleanBlockTitle = () => {
        const titleStart = block["$title"].indexOf("]")
        const cleanTitle = block["$title"].substring(titleStart + 1).trim()
        return cleanTitle
    }

    const cleanTrackingCategory = (tracking) => {
        if (tracking["type"] !== "TrackEvent") 
            return ""

        const [cleanCategory, _] = tracking["settings"]["category"].split('-')
        return cleanCategory.trim()
    }

    const getHighlight = (action) => {
        const highlightingFunctions = {
            "tracking category different from block title": (action) => cleanTrackingCategory(action) !== "" && cleanBlockTitle().toLowerCase() !== cleanTrackingCategory(action).toLowerCase()
        }

        shouldHighlight = highlightingFunctions[highlight]

        if (!shouldHighlight) 
            return false

        if (shouldHighlight(action))
            hasHighlight = true
    }

    function display(actions) {
        let formattedBlockTitle = `${block["$title"]}\n`
        
        const enteringActions = getEnteringProperties(actions)
        const leavingActions = getLeavingProperties(actions)

        const formattedEnteringActions = enteringActions ? `\tEntering Actions\n${enteringActions}` : ""
        const formattedLeavingActions = leavingActions ? `\tLeaving Actions\n${leavingActions}` : ""

        const formattedOutput = `${hasHighlight ? "--> " : ""}${formattedBlockTitle}${formattedEnteringActions}${formattedLeavingActions}`

        return { hasHighlight, formattedOutput }
    }

    function getEnteringProperties(actions) {
        const { trackings, scripts } = actions

        let enteringTrackings = trackings ? getActions("entering", "TrackEvent") : ""
        let enteringScripts = scripts ? getActions("entering", "ExecuteScript") : ""

        return `${enteringTrackings}${enteringScripts}`
    }

    function getLeavingProperties(actions) {
        const { trackings, scripts } = actions

        let leavingTrackings = trackings ? getActions("leaving", "TrackEvent") : ""
        let leavingScripts = scripts ? getActions("leaving", "ExecuteScript") : ""
 
        return `${leavingTrackings}${leavingScripts}`
    }
    
    function getActions(timing, type) {
        actionTiming = timing === "leaving" ? "$leavingCustomActions" : "$enteringCustomActions"
        const actions = block[actionTiming].filter(a => a["type"] === type)

        let formattedActionOutput = ""
        for (action of actions) {
            if (type === "TrackEvent")
                formattedActionOutput += getFormattedTracking(action)
            else if (type === "ExecuteScript")
                formattedActionOutput += getFormattedScript(action)
        }

        return formattedActionOutput
    }

    const getFormattedTracking = (tracking) => {      
        getHighlight(tracking)
        return `\t\tT ${tracking["$title"]}\n\t\t\tCategoria: ${tracking["settings"]["category"]}\n\t\t\tAção: ${tracking["settings"]["action"]}\n`
    }

    const getFormattedScript = (script) => {
        getHighlight(script)
        return `\t\tS+ ${script["$title"]}\n`
    }

    return {
        display,
        hasHighlight
    }
}

module.exports = report