import { Router } from "express";
import turfController from "../controller/turfController";
import { authentication, authorization } from "../middleware/auth";

const turfRouter = Router()

turfRouter.route('/turf').get(turfController.getAllTurfs)
turfRouter.route('/turf/:id').get(turfController.getSingleTurf)
turfRouter.route('/turf').post(authentication, authorization("ADMIN"), turfController.createNewTurf)
turfRouter.route('/turf').put(authentication, authorization("ADMIN"), turfController.updateTurf)
turfRouter.route('/turf/:id').delete(authentication, authorization("ADMIN"), turfController.deleteTurf)
turfRouter.route('/turf').delete(authentication, authorization("ADMIN"), turfController.deleteAllTurf)

export default turfRouter