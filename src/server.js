"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 3000; // "3000"
const SERVER_URL = process.env.SERVER_URL;
console.log(process.env.ENV);
app_1.default.listen(PORT, () => {
    logger_1.default.info(`Server is running`, {
        meta: {
            PORT,
            SERVER_URL
        }
    });
});
