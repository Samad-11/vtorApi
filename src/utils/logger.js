"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
require("winston-daily-rotate-file");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { errors, combine, json, timestamp, colorize, simple, printf } = winston_1.format;
const consoleLogFormat = winston_1.format.printf((info) => {
    const { level, message, timestamp, meta } = info;
    const customLevel = level.toUpperCase();
    const customMessage = message;
    const customTimestamp = timestamp;
    const customMeta = util_1.default.inspect(meta, {
        showHidden: false,
        depth: null
    });
    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\nMETA ${customMeta}\n`;
    return customLog;
});
const consoleTransport = () => {
    return [
        new winston_1.transports.Console({
            level: "info",
            format: combine(winston_1.format.timestamp(), consoleLogFormat)
        })
    ];
};
const fileFormat = printf((info) => {
    const { level, message, timestamp, meta } = info;
    const logMeta = {};
    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack || ''
            };
        }
        else {
            logMeta[key] = value;
        }
    }
    const logData = {
        level: level.toUpperCase(),
        message: message,
        timestamp,
        meta: logMeta
    };
    return `[${logData.timestamp}] ${logData.level} ${logData.message} ${util_1.default.inspect(logData.meta, { depth: null, showHidden: true })}`;
});
const fileTransport = () => {
    return [
        new winston_1.transports.DailyRotateFile({
            filename: path_1.default.join(__dirname, '..', '..', 'logs', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            level: 'info'
        })
    ];
};
const logger = (0, winston_1.createLogger)({
    defaultMeta: { meta: {} },
    format: combine(timestamp(), fileFormat),
    transports: [...consoleTransport(), ...fileTransport()]
});
exports.default = logger;
