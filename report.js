const filters = require('./filters.js')
const path = require('path')
const state = require('./state.js')

class Report {
    constructor(bot) {
        this.reportName
        this.bot = bot
        this.block = null
        this.totalBlocks = Object.keys(bot).length
        this.totalBlocksHighlighted = 0
        this.highlightingFunctions = {
            "tracking category different from block title": (action) => this.cleanTrackingCategory(action) !== "" && 
                this.cleanBlockTitle().toLowerCase() !== this.cleanTrackingCategory(action).toLowerCase(),
            "http request has basic name": (action) => !action["$title"].includes("-")
        }
        this.highlight = ''
        this.highlightName = ''
    }

    loadInstructions(filename) { return state().loadJson(`./instructions/reports/${filename}`) }
    save(report, filename) { return state().saveFile(report, `./output/reports/${filename}.txt`) }
    getReportName(reportFilename) { return path.parse(reportFilename).name }

    generate(reportName) {
        const instruction = this.loadInstructions(reportName)
        this.highlightName = instruction.highlight
        let totalBlocksMatchingCriteria = 0

        let reportStr = ""
        for (let blockName of Object.keys(bot)) {
            this.block = bot[blockName]
            
            if (filters().blockMatchesAll(this.block, instruction.criterias)) {
                totalBlocksMatchingCriteria += 1
                reportStr += this.display(instruction.display)            }
        }

        reportStr += this.getSummary(totalBlocksMatchingCriteria)

        this.save(reportStr, this.getReportName(reportName))
    }

    getSummary(totalBlocksMatchingCriteria) {
        let summary = `\nTotal blocks: ${this.totalBlocks}\n`
        summary += `Total blocks matching criteria: ${totalBlocksMatchingCriteria}\n`
        summary += `Total blocks highlighted: ${this.totalBlocksHighlighted}`
        return summary
    }

    cleanBlockTitle() {
        const titleStart = this.block["$title"].indexOf("]")
        const cleanTitle = this.block["$title"].substring(titleStart + 1).trim()
        return cleanTitle
    }

    cleanTrackingCategory(tracking) {
        if (tracking["type"] !== "TrackEvent") 
            return ""

        const [cleanCategory, _] = tracking["settings"]["category"].split('-')
        return cleanCategory.trim()
    }

    setHighlight(action) { 
        if (this.highlightingFunctions[this.highlightName](action)) {
            this.highlight = '-->'
            this.totalBlocksHighlighted += 1
        }
    }

    getHighlight() {
        const result = this.highlight
        this.highlight = ''
        return result
    }

    display(actions) {
        let formattedBlockTitle = `${this.block["$title"]}\n`
        
        const enteringActions = this.getEnteringProperties(actions)
        const leavingActions = this.getLeavingProperties(actions)

        const formattedEnteringActions = enteringActions ? `\tEntering Actions\n${enteringActions}` : ""
        const formattedLeavingActions = leavingActions ? `\tLeaving Actions\n${leavingActions}` : ""

        const formattedOutput = `${this.getHighlight()}${formattedBlockTitle}${formattedEnteringActions}${formattedLeavingActions}\n`

        return formattedOutput
    }

    getEnteringProperties(actions) {
        const { trackings, scripts, httpRequests } = actions

        let enteringTrackings = trackings ? this.getActions("entering", "TrackEvent") : ""
        let enteringScripts = scripts ? this.getActions("entering", "ExecuteScript") : ""
        let enteringHttpRequests = httpRequests ? this.getActions("entering", "ProcessHttp") : ""

        return `${enteringTrackings}${enteringScripts}${enteringHttpRequests}`
    }

    getLeavingProperties(actions) {
        const { trackings, scripts, httpRequests } = actions

        let leavingTrackings = trackings ? this.getActions("leaving", "TrackEvent") : ""
        let leavingScripts = scripts ? this.getActions("leaving", "ExecuteScript") : ""
        let leavingHttpRequests = httpRequests ? this.getActions("leaving", "ProcessHttp") : ""
 
        return `${leavingTrackings}${leavingScripts}${leavingHttpRequests}`
    }
    
    getActions(timing, type) {
        const actionTiming = timing === "leaving" ? "$leavingCustomActions" : "$enteringCustomActions"
        const actions = this.block[actionTiming].filter(a => a["type"] === type)

        let formattedActionOutput = ""
        for (let action of actions) {
            if (type === "TrackEvent")
                formattedActionOutput += this.getFormattedTracking(action)
            else if (type === "ExecuteScript")
                formattedActionOutput += this.getFormattedScript(action)
            else if (type === "ProcessHttp")
                formattedActionOutput += this.getFormattedHttpRequest(action)
        }

        return formattedActionOutput
    }

    getFormattedTracking(tracking) {      
        this.setHighlight(tracking)
        return `\t\tT ${tracking["$title"]}\n\t\t\tCategoria: ${tracking["settings"]["category"]}\n\t\t\tAção: ${tracking["settings"]["action"]}\n`
    }

    getFormattedScript(script) {
        this.setHighlight(script)
        return `\t\tS+ ${script["$title"]}\n`
    }

    getFormattedHttpRequest(httpRequest) {
        this.setHighlight(httpRequest)
        return `\t\tR+ ${httpRequest["$title"]} - ${httpRequest["settings"]["method"]}: ${httpRequest["settings"]["uri"]}\n`
    }
}

module.exports = Report