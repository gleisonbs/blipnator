function state() {
    var fs = require('fs')

    const saveJson = (obj, path) => {
        try {
            fs.writeFileSync(path, JSON.stringify(obj), { encoding: 'utf8', flag: 'w+' })
        } 
        catch (error) {
            console.log(error);
        }
    }

    const saveFile = (obj, path) => {
        try {
            fs.writeFileSync(path, obj, { encoding: 'utf8', flag: 'w+' })
        } 
        catch (error) {
            console.log(error);
        }
    }

    const loadJson = (path) => {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf-8'))
        } 
        catch (error) {
            console.log(error);
        }

        return ""
    }

    const loadFile = (path) => {
        try {
            return fs.readFileSync(path, 'utf-8')
        } 
        catch (error) {
            console.log(error);
        }

        return ""
    }

    return {
        saveJson,
        saveFile,
        loadJson,
        loadFile
    }
}

module.exports = state