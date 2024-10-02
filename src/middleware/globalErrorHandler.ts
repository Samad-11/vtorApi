import { NextFunction, Request, Response } from "express";
import { THttpError } from "../types/type";

export default (err: THttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode).json(err);
    next();
}