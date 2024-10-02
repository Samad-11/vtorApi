import { format, createLogger, transports } from 'winston'
import 'winston-daily-rotate-file'
import utils from 'util'
import { ConsoleTransportInstance } from 'winston/lib/winston/transports'
import path from 'path'
import 'winston-daily-rotate-file'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { errors, combine, json, timestamp, colorize, simple, printf } = format

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta } = info

    const customLevel = level.toUpperCase()
    const customMessage = message
    const customTimestamp = timestamp
    const customMeta = utils.inspect(meta, {
        showHidden: false,
        depth: null
    })

    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\nMETA ${customMeta}\n`
    return customLog
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    return [
        new transports.Console({
            level: "info",
            format: combine(format.timestamp(), consoleLogFormat)
        })
    ]
}
const fileFormat = printf((info) => {
    const { level, message, timestamp, meta } = info
    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message: message,
        timestamp,
        meta: logMeta
    }
    return `[${logData.timestamp}] ${logData.level} ${logData.message} ${utils.inspect(logData.meta, { depth: null, showHidden: true })}`
})

const fileTransport = () => {
    return [
        new transports.DailyRotateFile({
            filename: path.join(__dirname, '..', '..', 'logs', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            level: 'info'

        })
    ]
}


const logger = createLogger({
    defaultMeta: { meta: {} },
    format: combine(timestamp(), fileFormat),
    transports: [...consoleTransport(), ...fileTransport()]
})
export default logger