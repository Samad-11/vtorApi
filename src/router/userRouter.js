"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
userRouter.route('/user').get(userController_1.default.getAllUsers);
userRouter.route('/user/register').post(userController_1.default.addNewUser);
userRouter.route('/user/login').post(userController_1.default.loginUser);
userRouter.route('/user/new-admin').post(auth_1.authentication, (0, auth_1.authorization)("SUPERADMIN"), userController_1.default.addNewAdmin);
exports.default = userRouter;
