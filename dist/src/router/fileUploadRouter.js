"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerStorage_1 = require("../utils/multerStorage");
const helper_1 = require("../utils/helper");
const logger_1 = __importDefault(require("../utils/logger"));
const responseMessage_1 = __importDefault(require("../constant/responseMessage"));
const uploadFileRouter = (0, express_1.Router)();
uploadFileRouter.route('/file/upload').post((multerStorage_1.upload.array('turfImages', 10)), (req, res, next) => {
    try {
        logger_1.default.info("Trying to upload files");
        if (!req.files) {
            logger_1.default.error("No file to upload");
            (0, helper_1.httpsError)(next, new Error("No file to upload"), req, 400);
        }
        const files = req.files;
        const fileUrl = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        logger_1.default.info("Files uploaded successfully");
        (0, helper_1.httpResponse)(req, res, 200, "File saved successfully", fileUrl);
    }
    catch (error) {
        logger_1.default.error("Error uploading files", error);
        (0, helper_1.httpsError)(next, error, req);
    }
});
uploadFileRouter.route('/file/delete').post(deleteFilesController);
async function deleteFilesController(req, res, next) {
    try {
        logger_1.default.info("Trying to delete files");
        const { urls } = req.body;
        await (0, multerStorage_1.deleteFiles)(urls);
        logger_1.default.info("Files deleted successful");
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success);
    }
    catch (error) {
        logger_1.default.error("Error deleting files", error);
        (0, helper_1.httpsError)(next, error, req);
    }
}
exports.default = uploadFileRouter;
