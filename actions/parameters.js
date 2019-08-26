parameters = {

    get: (block) => {
        const blockMarker = "]"
        const hasSquareBrackets = () => block["$title"].includes(`${blockMarker} `)
        const getCleanTitle = () => {
            if (hasSquareBrackets())
                return block["$title"].substr(block["$title"].indexOf(blockMarker) + 1).trim()
            return block["$title"]
        }
        const getPossibleAnswers = () => JSON.stringify(block["$inputSuggestions"])
        return {
            name: getCleanTitle(),
            possibleAnswers: getPossibleAnswers()
        }
    }
}

module.exports = parameters