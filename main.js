const state = require('./state.js')
const parameters = require('./actions/parameters.js')
const filters = require('./filters.js')
const report = require('./report.js')
const actions = require('./actions/actions.js')


const saveBot = (bot) => state().save(bot, './output/newbot.json')
const loadBot = () => state().load(process.argv[2])
const loadInstructions = () => state().load(process.argv[3])

function start() {    
    bot = loadBot()
    instructions = loadInstructions()

    for (operation of instructions.report) {
        let totalBlocks = 0
        let totalBlocksMatchingCriteria = 0
        let totalBlocksHighlighted = 0
        for (blockName of Object.keys(bot)) {
            block = bot[blockName]
            
            if (filters().blockMatchesAll(block, operation.criterias)) {
                totalBlocksMatchingCriteria += 1
                const { hasHighlight, formattedOutput } = report(block, operation.highlight).display(operation.display)
                console.log(formattedOutput)
                if (hasHighlight)
                    totalBlocksHighlighted += 1
            }
            totalBlocks += 1
        }

        console.log(`\n\nTotal blocks: ${totalBlocks}`)
        console.log(`Total blocks matching criteria: ${totalBlocksMatchingCriteria}`)
        console.log(`Total blocks highlighted: ${totalBlocksHighlighted}`)
    }

    for (operation of instructions.remove) {
        for (blockName of Object.keys(bot)) {
            block = bot[blockName]
        }
    }

    for (operation of instructions.add) {
        for (blockName of Object.keys(bot)) {
            block = bot[blockName]

            if (filters().blockMatchesAll(block, operation.criterias))
                operation.actions.forEach(a => actions().addToBlock(a, block, parameters.get(block)))    
        }     
    }

    saveBot(bot)
}

start()