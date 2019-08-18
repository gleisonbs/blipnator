const state = require('./state.js')
const parameters = require('./actions/parameters.js')
const filters = require('./filters.js')
const report = require('./report.js')
const actions = require('./actions/actions.js')


const saveBot = (bot) => state().saveJson(bot, './output/newbot.json')
const saveReport = (report) => state().saveFile(report, './output/report.txt')
const loadBot = () => state().loadJson(process.argv[2])
const loadInstructions = () => state().loadJson(process.argv[3])

function start() {    
    bot = loadBot()
    instructions = loadInstructions()

    for (operation of instructions.report) {
        let totalBlocks = 0
        let totalBlocksMatchingCriteria = 0
        let totalBlocksHighlighted = 0

        let reportStr = ""
        for (blockName of Object.keys(bot)) {
            block = bot[blockName]
            
            if (filters().blockMatchesAll(block, operation.criterias)) {
                totalBlocksMatchingCriteria += 1
                const { hasHighlight, formattedOutput } = report(block, operation.highlight).display(operation.display)
                reportStr += formattedOutput
                if (hasHighlight)
                    totalBlocksHighlighted += 1
            }
            totalBlocks += 1
        }

        reportStr += `\nTotal blocks: ${totalBlocks}\n`
        reportStr += `Total blocks matching criteria: ${totalBlocksMatchingCriteria}`
        reportStr += `Total blocks highlighted: ${totalBlocksHighlighted}`

        saveReport(reportStr)
    }

    for (operation of instructions.remove) {
        for (blockName of Object.keys(bot)) {
            block = bot[blockName]

            if (filters().blockMatchesAll(block, operation.criterias))
                actions().removeFromBlock(block, operation.type)    
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