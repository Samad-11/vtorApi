"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const prisma_1 = __importDefault(require("../utils/prisma"));
const responseMessage_1 = __importDefault(require("../constant/responseMessage"));
const validationSchema_1 = require("../utils/validationSchema");
const multerStorage_1 = require("../utils/multerStorage");
const logger_1 = __importDefault(require("../utils/logger"));
async function getAllTurfs(req, res, next) {
    try {
        logger_1.default.info('Trying to get allTurfs');
        const turfs = await prisma_1.default.turf.findMany({ orderBy: [{ updatedAt: "desc" }] });
        logger_1.default.info("All turfs fetched successful");
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, turfs);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function getSingleTurf(req, res, next) {
    try {
        const { id } = req.params;
        logger_1.default.info('Trying to get singleTurf', { meta: { id } });
        const turf = await prisma_1.default.turf.findUnique({ where: { id: Number(id) } });
        if (!turf) {
            (0, helper_1.httpsError)(next, new Error("Turf not found"), req, 404);
        }
        logger_1.default.info("Turf fetched successful", { meta: { id } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, turf);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function createNewTurf(req, res, next) {
    try {
        logger_1.default.info("Trying to create new turf", { meta: req.body });
        const validation = validationSchema_1.turfSchema.parse(req.body);
        const newTurf = await prisma_1.default.turf.create({
            data: {
                ...validation
            }
        });
        logger_1.default.info("Turf created successful", { meta: { turf_id: newTurf.id, turf_name: newTurf.name } });
        (0, helper_1.httpResponse)(req, res, 201, responseMessage_1.default.success, newTurf);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function updateTurf(req, res, next) {
    try {
        logger_1.default.info("Trying to update turf", { meta: req.body });
        const validation = validationSchema_1.updateTurfSchema.parse(req.body);
        const { id, ...data } = validation;
        const updatedTurf = await prisma_1.default.turf.update({
            where: {
                id
            },
            data
        });
        logger_1.default.info("Turf updated successful", { meta: { turf_id: updatedTurf.id, turf_name: updatedTurf.name } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, updatedTurf);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function deleteTurf(req, res, next) {
    try {
        logger_1.default.info("Trying to delete turf", { meta: { id: req.params } });
        const { id } = req.params;
        const deletedTurf = await prisma_1.default.turf.delete({
            where: {
                id: Number(id)
            }
        });
        if (!deletedTurf) {
            (0, helper_1.httpsError)(next, new Error("Something went wrong"), req, 400);
        }
        await (0, multerStorage_1.deleteFiles)(deletedTurf.images);
        logger_1.default.info("Turf deleted successful", { meta: { id } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, deletedTurf);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function deleteAllTurf(req, res, next) {
    try {
        logger_1.default.info("Trying to delete all turfs");
        const deletedTurfs = await prisma_1.default.turf.deleteMany({});
        logger_1.default.info("All turfs deleted successful");
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, deletedTurfs);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
exports.default = {
    getAllTurfs,
    getSingleTurf,
    createNewTurf,
    updateTurf,
    deleteTurf,
    deleteAllTurf
};
