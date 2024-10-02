import { Router } from "express";
import bookingController from "../controller/bookingController";
import { authentication, authorization } from "../middleware/auth";

const bookingRouter = Router();


bookingRouter.route("/booking").get(authentication, authorization('ADMIN'), bookingController.getAllBooking)
bookingRouter.route("/booking").post(authentication, bookingController.createNewBooking)
bookingRouter.route("/booking").put(authentication, authorization('ADMIN'), bookingController.updateBooking)
bookingRouter.route("/booking/my").post(authentication, bookingController.getMyBooking)
bookingRouter.route("/booking/:turfId/:date").get(bookingController.getAllSlots)

export default bookingRouter