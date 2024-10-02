import { NextFunction, Request, Response } from "express";
import responseMessage from "../constant/responseMessage";
import { httpResponse, httpsError } from "../utils/helper";
import bcryptjs from "bcryptjs"
import { loginUserValidationSchema, registerUserValidationSchema } from "../utils/validationSchema";
import { generateToken } from "../utils/jwtUtils";
import prisma from "../utils/prisma";
import logger from "../utils/logger";



async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {

        logger.info("Trying to fetch all users")
        const users = await prisma.user.findMany({});
        logger.info('Users fetched successfully')
        httpResponse(req, res, 200, responseMessage.success, users)
    } catch (err) {
        httpsError(next, err, req)
    }
}


async function addNewUser(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to add new user", { meta: { name: req.body.name, email: req.body.email } })
        const validation = registerUserValidationSchema.parse(req.body)
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: validation.email
            }
        })
        if (isUserExist) {
            logger.error("User already exist with this email", { meta: new Error("User Already Exists") })
            httpsError(next, new Error("User Already Exists"), req, 409)
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, password, ...data } = validation

        const hashedPassword = await bcryptjs.hash(password, 10)


        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            }
        })

        const { id, email, name, role, phone, createdAt, updatedAt } = newUser
        logger.info('User created successfully', { meta: { name, email } })
        httpResponse(req, res, 201, responseMessage.success, { id, email, name, role, phone, createdAt, updatedAt })
    } catch (err) {
        httpsError(next, err, req)
    }
}
async function addNewAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to add new admin", { meta: { name: req.body.name, email: req.body.email } })
        const validation = registerUserValidationSchema.parse(req.body)
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: validation.email
            }
        })
        if (isUserExist) {
            logger.error("account already exist with this email", { meta: new Error("User Already Exists") })
            httpsError(next, new Error("User Already Exists"), req, 409)
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, password, ...data } = validation

        const hashedPassword = await bcryptjs.hash(password, 10)


        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: "ADMIN"
            }
        })

        const { id, email, name, role, phone, createdAt, updatedAt } = newUser
        logger.info('User created successfully', { meta: { name, email } })
        httpResponse(req, res, 201, responseMessage.success, { id, email, name, role, phone, createdAt, updatedAt })
    } catch (err) {
        httpsError(next, err, req)
    }
}




async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to login", { meta: { email: req.body.email } })
        loginUserValidationSchema.parse(req.body)
        const email = req.body.email as string
        const pass = req.body.password as string
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user || !(await bcryptjs.compare(pass, user.password))) {
            logger.error("Invalid Credentials", { meta: new Error("Invalid Credentials") })
            httpsError(next, new Error("Invalid Credentials"), req, 401);
            return
        }
        const token = generateToken({ email, id: user.id, role: user.role })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user
        logger.info('User logged in successfully', { meta: { name: user.name, email: user.email } })
        httpResponse(req, res, 200, responseMessage.success, { userWithoutPassword, token })
    } catch (err) {
        httpsError(next, err, req)
    }
}



export default {
    getAllUsers,
    addNewUser,
    loginUser,
    addNewAdmin
};