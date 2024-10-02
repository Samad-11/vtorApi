"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    res.status(err.statusCode).json(err);
    next();
};
