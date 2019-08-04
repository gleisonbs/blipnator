function state() {
    var fs = require('fs')

    const save = (obj, path) => {
        try {
            fs.writeFileSync(path, JSON.stringify(obj), { encoding: 'utf8', flag: 'w+' })
        } 
        catch (error) {
            console.log(error);
        }
    }

    const load = (path) => {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf-8'))
        } 
        catch (error) {
            console.log(error);
        }

        return ""
    }

    return {
        save,
        load
    }
}

module.exports = state