"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = __importDefault(require("../controller/bookingController"));
const auth_1 = require("../middleware/auth");
const bookingRouter = (0, express_1.Router)();
bookingRouter.route("/booking").get(auth_1.authentication, (0, auth_1.authorization)('ADMIN'), bookingController_1.default.getAllBooking);
bookingRouter.route("/booking").post(auth_1.authentication, bookingController_1.default.createNewBooking);
bookingRouter.route("/booking").put(auth_1.authentication, (0, auth_1.authorization)('ADMIN'), bookingController_1.default.updateBooking);
bookingRouter.route("/booking/my").post(auth_1.authentication, bookingController_1.default.getMyBooking);
bookingRouter.route("/booking/:turfId/:date").get(bookingController_1.default.getAllSlots);
exports.default = bookingRouter;
