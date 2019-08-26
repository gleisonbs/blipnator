const trackings = require('./trackings.js')
const scripts = require('./scripts.js')
const tags = require('./tags.js')

function actions() {
    const blockDoesntContainAction = (block, action, actionTime) => action && block[actionTime].filter(a => a["$title"] === action["$title"]).length === 0
    const blockDoesntContainTag = (tag, block) => tag && block["$tags"].filter(t => t.label === tag.label).length === 0
    const getActionTiming = (time) => time && time.toLowerCase() === 'leaving' ? '$leavingCustomActions' : '$enteringCustomActions'

    function getByTypeAndName(type, name, parameters) {
        type = type.toLowerCase()
        name = name.toLowerCase()
        if (type === 'tracking')
            return trackings().getByName(name, parameters)
        else if (type === 'script')
            return scripts().getByName(name, parameters)
    }

    function addTagToBlock(tagName, block) {
        if (tagName) {
            const tag = tags[tagName.toLowerCase()]

            block["$tags"] = block["$tags"].filter(t => t["label"].toLowerCase() !== tagName.toLowerCase())
            block["$tags"].push(tag);
        }
    }

    const removeTagFromBlock = (tagLabel, block) => block["$tags"] = block["$tags"].filter(t => t["$label"] !== tagLabel)

    function removeFromBlock(actionToRemove, block) {
        timings = ["$enteringCustomActions", "$leavingCustomActions"]
        if (actionToRemove.type === "TrackEvent") {
            for (let time of timings)
                block[time] = block[time].filter(a => a["type"] !== actionToRemove.type || 
                (!a["settings"]["category"].includes(actionToRemove.pattern) && !a["settings"]["action"].includes(actionToRemove.pattern)))
        }
        else if (actionToRemove.type === "Tag") {
            block["$tags"] = block["$tags"].filter(t => t["label"].toLowerCase() !== actionToRemove.pattern.toLowerCase())
        }
        else if (actionToRemove.type === "ExecuteScript") {
            for (let time of timings)
                block[time] = block[time].filter(a => a["type"] !== actionToRemove.type || !a["$title"].includes(actionToRemove.pattern))
        }
    }

    function addToBlock(action, block, parameters) {

        const actionTime = getActionTiming(action.time)
        const actionToAdd = getByTypeAndName(action.type, action.name, parameters)

        if (blockDoesntContainAction(block, actionToAdd, actionTime)) {
            block[actionTime].push(actionToAdd)
            addTagToBlock(action.tag, block)
        }
    }

    return {
        getByTypeAndName,
        addToBlock,
        removeFromBlock
    }
}

module.exports = actions