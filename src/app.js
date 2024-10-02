"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const applicaton_1 = require("./constant/applicaton");
const turfRouter_1 = __importDefault(require("./router/turfRouter"));
const bookingRouter_1 = __importDefault(require("./router/bookingRouter"));
const fileUploadRouter_1 = __importDefault(require("./router/fileUploadRouter"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({}));
app.use((req, res, next) => {
    logger_1.default.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express_1.default.static('uploads'));
// routes
app.use(applicaton_1.apiStartParams, userRouter_1.default);
app.use(applicaton_1.apiStartParams, turfRouter_1.default);
app.use(applicaton_1.apiStartParams, bookingRouter_1.default);
app.use(applicaton_1.apiStartParams, fileUploadRouter_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
