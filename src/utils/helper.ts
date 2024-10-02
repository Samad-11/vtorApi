import { NextFunction, Request, Response } from "express";
import { THttpError, THttpResponse } from "../types/type";
import { ZodError } from "zod";
import logger from "./logger";

export const httpResponse = (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null) => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        message: responseMessage,
        data,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || null
        }
    }

    if (process.env.ENV !== "development") {
        delete response.request.ip
    }
    res.status(response.statusCode).json(response)
}

export const httpsError = (next: NextFunction, error: Error | unknown, req: Request, errorStatusCode = 500) => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        data: error instanceof ZodError ? error.issues : error instanceof Error ? error.stack : null,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || null
        },
        trace: error instanceof Error ? { error: error.stack } : null
    }

    if (process.env.ENV !== "development") {
        delete errorObj.request.ip
        delete errorObj.trace
    }
    let message: string;
    if (error instanceof ZodError) {
        message = error.issues.map((issue) => issue.message).join(", ")
    } else {
        message = errorObj.message
    }
    logger.error(message)
    return next(errorObj)
}

