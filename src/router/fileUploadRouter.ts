import { NextFunction, Request, Response, Router } from "express";
import { deleteFiles, upload } from "../utils/multerStorage";
import { httpResponse, httpsError } from "../utils/helper";
import logger from "../utils/logger";
import responseMessage from "../constant/responseMessage";

const uploadFileRouter = Router()

uploadFileRouter.route('/file/upload').post((upload.array('turfImages', 10)), (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Trying to upload files")
        if (!req.files) {
            logger.error("No file to upload")
            httpsError(next, new Error("No file to upload"), req, 400)
        }

        const files = req.files as Express.Multer.File[]
        const fileUrl = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)

        logger.info("Files uploaded successfully")
        httpResponse(req, res, 200, "File saved successfully", fileUrl)
    } catch (error) {
        logger.error("Error uploading files", error)
        httpsError(next, error, req)
    }
})

uploadFileRouter.route('/file/delete').post(deleteFilesController)

async function deleteFilesController(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to delete files")
        const { urls } = req.body

        await deleteFiles(urls)
        logger.info("Files deleted successful")
        httpResponse(req, res, 200, responseMessage.success)
    } catch (error) {
        logger.error("Error deleting files", error)
        httpsError(next, error, req)
    }
}
export default uploadFileRouter