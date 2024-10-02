"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessage_1 = __importDefault(require("../constant/responseMessage"));
const helper_1 = require("../utils/helper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validationSchema_1 = require("../utils/validationSchema");
const jwtUtils_1 = require("../utils/jwtUtils");
const prisma_1 = __importDefault(require("../utils/prisma"));
const logger_1 = __importDefault(require("../utils/logger"));
async function getAllUsers(req, res, next) {
    try {
        logger_1.default.info("Trying to fetch all users");
        const users = await prisma_1.default.user.findMany({});
        logger_1.default.info('Users fetched successfully');
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, users);
    }
    catch (err) {
        (0, helper_1.httpsError)(next, err, req);
    }
}
async function addNewUser(req, res, next) {
    try {
        logger_1.default.info("Trying to add new user", { meta: { name: req.body.name, email: req.body.email } });
        const validation = validationSchema_1.registerUserValidationSchema.parse(req.body);
        const isUserExist = await prisma_1.default.user.findUnique({
            where: {
                email: validation.email
            }
        });
        if (isUserExist) {
            logger_1.default.error("User already exist with this email", { meta: new Error("User Already Exists") });
            (0, helper_1.httpsError)(next, new Error("User Already Exists"), req, 409);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, password, ...data } = validation;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                ...data,
                password: hashedPassword
            }
        });
        const { id, email, name, role, phone, createdAt, updatedAt } = newUser;
        logger_1.default.info('User created successfully', { meta: { name, email } });
        (0, helper_1.httpResponse)(req, res, 201, responseMessage_1.default.success, { id, email, name, role, phone, createdAt, updatedAt });
    }
    catch (err) {
        (0, helper_1.httpsError)(next, err, req);
    }
}
async function addNewAdmin(req, res, next) {
    try {
        logger_1.default.info("Trying to add new admin", { meta: { name: req.body.name, email: req.body.email } });
        const validation = validationSchema_1.registerUserValidationSchema.parse(req.body);
        const isUserExist = await prisma_1.default.user.findUnique({
            where: {
                email: validation.email
            }
        });
        if (isUserExist) {
            logger_1.default.error("account already exist with this email", { meta: new Error("User Already Exists") });
            (0, helper_1.httpsError)(next, new Error("User Already Exists"), req, 409);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, password, ...data } = validation;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: "ADMIN"
            }
        });
        const { id, email, name, role, phone, createdAt, updatedAt } = newUser;
        logger_1.default.info('User created successfully', { meta: { name, email } });
        (0, helper_1.httpResponse)(req, res, 201, responseMessage_1.default.success, { id, email, name, role, phone, createdAt, updatedAt });
    }
    catch (err) {
        (0, helper_1.httpsError)(next, err, req);
    }
}
async function loginUser(req, res, next) {
    try {
        logger_1.default.info("Trying to login", { meta: { email: req.body.email } });
        validationSchema_1.loginUserValidationSchema.parse(req.body);
        const email = req.body.email;
        const pass = req.body.password;
        const user = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user || !(await bcryptjs_1.default.compare(pass, user.password))) {
            logger_1.default.error("Invalid Credentials", { meta: new Error("Invalid Credentials") });
            (0, helper_1.httpsError)(next, new Error("Invalid Credentials"), req, 401);
            return;
        }
        const token = (0, jwtUtils_1.generateToken)({ email, id: user.id, role: user.role });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        logger_1.default.info('User logged in successfully', { meta: { name: user.name, email: user.email } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, { userWithoutPassword, token });
    }
    catch (err) {
        (0, helper_1.httpsError)(next, err, req);
    }
}
exports.default = {
    getAllUsers,
    addNewUser,
    loginUser,
    addNewAdmin
};
