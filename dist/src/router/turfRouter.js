"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turfController_1 = __importDefault(require("../controller/turfController"));
const auth_1 = require("../middleware/auth");
const turfRouter = (0, express_1.Router)();
turfRouter.route('/turf').get(turfController_1.default.getAllTurfs);
turfRouter.route('/turf/:id').get(turfController_1.default.getSingleTurf);
turfRouter.route('/turf').post(auth_1.authentication, (0, auth_1.authorization)("ADMIN"), turfController_1.default.createNewTurf);
turfRouter.route('/turf').put(auth_1.authentication, (0, auth_1.authorization)("ADMIN"), turfController_1.default.updateTurf);
turfRouter.route('/turf/:id').delete(auth_1.authentication, (0, auth_1.authorization)("ADMIN"), turfController_1.default.deleteTurf);
turfRouter.route('/turf').delete(auth_1.authentication, (0, auth_1.authorization)("ADMIN"), turfController_1.default.deleteAllTurf);
exports.default = turfRouter;
