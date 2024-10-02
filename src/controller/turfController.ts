import { NextFunction, Request, Response } from "express";
import { httpResponse, httpsError } from "../utils/helper";
import prisma from "../utils/prisma";
import responseMessage from "../constant/responseMessage";
import { turfSchema, updateTurfSchema } from "../utils/validationSchema";
import { deleteFiles } from "../utils/multerStorage";
import logger from "../utils/logger";

async function getAllTurfs(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('Trying to get allTurfs')
        const turfs = await prisma.turf.findMany({ orderBy: [{ updatedAt: "desc" }] });
        logger.info("All turfs fetched successful")
        httpResponse(req, res, 200, responseMessage.success, turfs)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function getSingleTurf(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        logger.info('Trying to get singleTurf', { meta: { id } })
        const turf = await prisma.turf.findUnique({ where: { id: Number(id) } });
        if (!turf) {
            httpsError(next, new Error("Turf not found"), req, 404);
        }
        logger.info("Turf fetched successful", { meta: { id } })
        httpResponse(req, res, 200, responseMessage.success, turf)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function createNewTurf(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to create new turf", { meta: req.body })
        const validation = turfSchema.parse(req.body)
        const newTurf = await prisma.turf.create({
            data: {
                ...validation
            }
        })
        logger.info("Turf created successful", { meta: { turf_id: newTurf.id, turf_name: newTurf.name } })
        httpResponse(req, res, 201, responseMessage.success, newTurf)
    } catch (error) {
        httpsError(next, error, req)
    }
}


async function updateTurf(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to update turf", { meta: req.body })
        const validation = updateTurfSchema.parse(req.body)
        const { id, ...data } = validation

        const updatedTurf = await prisma.turf.update({
            where: {
                id
            },
            data
        })
        logger.info("Turf updated successful", { meta: { turf_id: updatedTurf.id, turf_name: updatedTurf.name } })
        httpResponse(req, res, 200, responseMessage.success, updatedTurf)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function deleteTurf(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to delete turf", { meta: { id: req.params } })
        const { id } = req.params
        const deletedTurf = await prisma.turf.delete({
            where: {
                id: Number(id)
            }
        })

        if (!deletedTurf) {
            httpsError(next, new Error("Something went wrong"), req, 400);
        }
        await deleteFiles(deletedTurf.images)
        logger.info("Turf deleted successful", { meta: { id } })
        httpResponse(req, res, 200, responseMessage.success, deletedTurf)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function deleteAllTurf(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to delete all turfs")
        const deletedTurfs = await prisma.turf.deleteMany({})
        logger.info("All turfs deleted successful")
        httpResponse(req, res, 200, responseMessage.success, deletedTurfs)
    } catch (error) {
        httpsError(next, error, req)
    }
}
export default {
    getAllTurfs,
    getSingleTurf,
    createNewTurf,
    updateTurf,
    deleteTurf,
    deleteAllTurf

}