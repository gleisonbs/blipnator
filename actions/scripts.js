function scripts() {
    let getByName = (name, parameters) => {
        const mappings = {
            laststate: {
                "type": "ExecuteScript",
                "$title": "Executar script Update lastState",
                "$invalid": false,
                "settings": {
                    "function": "run",
                    "source": "function run() {\n    return \"" + parameters.name + "\"; //Return value will be saved as \"Return value variable\" field name\n}",
                    "inputVariables": [],
                    "outputVariable": "lastState"
                }
            }
        }

        return mappings[name]
    }

    return {
        getByName
    }
}

module.exports = scripts