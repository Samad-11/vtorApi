"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsError = exports.httpResponse = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("./logger"));
const httpResponse = (req, res, responseStatusCode, responseMessage, data = null) => {
    const response = {
        success: true,
        statusCode: responseStatusCode,
        message: responseMessage,
        data,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || null
        }
    };
    if (process.env.ENV !== "development") {
        delete response.request.ip;
    }
    res.status(response.statusCode).json(response);
};
exports.httpResponse = httpResponse;
const httpsError = (next, error, req, errorStatusCode = 500) => {
    const errorObj = {
        success: false,
        statusCode: errorStatusCode,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        data: error instanceof zod_1.ZodError ? error.issues : error instanceof Error ? error.stack : null,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || null
        },
        trace: error instanceof Error ? { error: error.stack } : null
    };
    if (process.env.ENV !== "development") {
        delete errorObj.request.ip;
        delete errorObj.trace;
    }
    let message;
    if (error instanceof zod_1.ZodError) {
        message = error.issues.map((issue) => issue.message).join(", ");
    }
    else {
        message = errorObj.message;
    }
    logger_1.default.error(message);
    return next(errorObj);
};
exports.httpsError = httpsError;
