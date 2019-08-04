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
        const tag = tags[tagName.toLowerCase()]

        if (blockDoesntContainTag(tag, block))
            block["$tags"].push(tag);
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
        addToBlock
    }
}

module.exports = actions