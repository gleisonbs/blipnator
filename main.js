const state = require('./state.js')
const parameters = require('./actions/parameters.js')
const filters = require('./filters.js')
const actions = require('./actions/actions.js')


const saveBot = (bot) => state().save(bot, './output/newbot.json')
const loadBot = () => state().load(process.argv[2])
const loadInstructions = () => state().load(process.argv[3])

function start() {    
    bot = loadBot()
    instructions = loadInstructions()


    for (blockName of Object.keys(bot)) {
        block = bot[blockName]
        
        for (operation of instructions.addOperations) {
            if (filters().blockMatchesAll(block, operation.criterias))
                operation.actions.forEach(a => actions().addToBlock(a, block, parameters.get(block)))
        }

        for (operation of instructions.removeOperations) {
            console.log("Remove operations are not supported yet.")
            break
        }
    }

    saveBot(bot)
}

start()