parameters = {

    get: (block) => {
        const getCleanTitle = () => block["$title"]
        const getPossibleAnswers = () => JSON.stringify(block["$inputSuggestions"])
        return {
            name: getCleanTitle(),
            possibleAnswers: getPossibleAnswers()
        }
    }
}

module.exports = parameters