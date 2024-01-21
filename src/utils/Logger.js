import log4js from 'log4js'

log4js.configure({
    appenders: {
        consola: { type: "console" },
        debugFile: { type: "file", filename: './debug.log'}
    },
    categories: {
        default: {
            appenders: ["consola"], level: "all"
        },  
        ErrLogger: {
            appenders: ["debugFile"], level: "ERROR"
        },
        LogInfo:{
            appenders: ["consola"], level: "DEBUG"
        }
    }
})

const errorLogger = log4js.getLogger('ErrLogger')
const logInfo = log4js.getLogger('LogInfo')

export {
        errorLogger,
        logInfo
        }