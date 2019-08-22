const state = require('./state.js')
const fs = require('fs')
const path = require('path')
const parameters = require('./actions/parameters.js')
const filters = require('./filters.js')
const Report = require('./report.js')
const actions = require('./actions/actions.js')

const saveBot = (bot) => state().saveJson(bot, './output/newbot.json')
const loadBot = () => state().loadJson(process.argv[2])

const getInstructionsList = (path) => fs.readdirSync(path)
const loadInstructions = (path) => state().loadJson(path)

function start() {
    bot = loadBot()

    const report = new Report(bot)
    const reportList = getInstructionsList('./instructions/reports')
    for (reportName of reportList)
        report.generate(reportName)

    // getInstructionsList('./instructions/remove').forEach(removeInstructions => {
    //     const instruction = loadInstructions(`./instructions/remove/${removeInstructions}`)
    //     for (blockName of Object.keys(bot)) {
    //         block = bot[blockName]
            
    //         if (filters().blockMatchesAll(block, instruction.criterias))
    //             actions().removeFromBlock(block, instruction.type)    
    //     }
    // })

    // getInstructionsList('./instructions/add').forEach(addInstructions => {
    //     const instructions = loadInstructions(`./instructions/add/${addInstructions}`)
    //     for (blockName of Object.keys(bot)) {
    //         block = bot[blockName]

    //         if (filters().blockMatchesAll(block, instructions.criterias))
    //             instructions.actions.forEach(a => actions().addToBlock(a, block, parameters.get(block)))
    //     }     
    // })

    // saveBot(bot)
}

start()