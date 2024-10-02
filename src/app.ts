import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import globalErrorHandler from "./middleware/globalErrorHandler"
import userRouter from "./router/userRouter"
import { apiStartParams } from "./constant/applicaton"
import turfRouter from "./router/turfRouter"
import bookingRouter from "./router/bookingRouter"
import uploadFileRouter from "./router/fileUploadRouter"
import logger from "./utils/logger"


const app: Application = express()

// middlewares
app.use(express.json())
app.use(cors({

}
))
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static('uploads'));

// routes
app.use(apiStartParams, userRouter)
app.use(apiStartParams, turfRouter)
app.use(apiStartParams, bookingRouter)
app.use(apiStartParams, uploadFileRouter)



//global error handler

app.use(globalErrorHandler)

export default app