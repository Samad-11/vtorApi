import { Router } from "express";
import userController from "../controller/userController";
import { authentication, authorization } from "../middleware/auth";

const userRouter = Router()

userRouter.route('/user').get(userController.getAllUsers)
userRouter.route('/user/register').post(userController.addNewUser)
userRouter.route('/user/login').post(userController.loginUser)
userRouter.route('/user/new-admin').post(authentication, authorization("SUPERADMIN"), userController.addNewAdmin)

export default userRouter