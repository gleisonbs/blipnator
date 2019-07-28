const trackings = require('./trackings.js')
const scripts = require('./scripts.js')
const tags = require('./tags.js')

function actions() {
    function getByTypeAndName(type, name, parameters) {
        type = type.toLowerCase()
        name = name.toLowerCase()
        if (type === 'tracking')
            return trackings().getByName(name, parameters)
        else if (type === 'script')
            return scripts().getByName(name, parameters)
    }

    function addTagToBlock(tag, block) {
        if (tag)
            block["$tags"].push(tags[tag.toLowerCase()]);
    }

    function addToBlock(action, block, parameters) {
        let getActionTiming = (time) => time && time.toLowerCase() === 'leaving' ? '$leavingCustomActions' : '$enteringCustomActions'

        const actionTime = getActionTiming(action.time)
        const actionToAdd = getByTypeAndName(action.type, action.name, parameters)
        block[actionTime].push(actionToAdd)

        addTagToBlock(action.tag, block)
    }

    return {
        getByTypeAndName,
        addToBlock
    }
}

module.exports = actions