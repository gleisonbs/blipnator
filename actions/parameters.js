parameters = {

    get: (block) => {
        const cleanTitle = () => block["$title"]
        return {
            name: cleanTitle()
        }
    }
}

module.exports = parameters