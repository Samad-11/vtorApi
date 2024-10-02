"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const prisma_1 = __importDefault(require("../utils/prisma"));
const responseMessage_1 = __importDefault(require("../constant/responseMessage"));
const validationSchema_1 = require("../utils/validationSchema");
const logger_1 = __importDefault(require("../utils/logger"));
async function getAllBooking(req, res, next) {
    try {
        const { from, to } = req.query;
        logger_1.default.info("Trying to get all booking", { meta: { from, to } });
        const bookings = await prisma_1.default.booking.findMany({
            where: {
                date: {
                    gte: from ? new Date(from) : undefined,
                    lte: to ? new Date(to) : undefined
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: { turf: true, user: true }
        });
        logger_1.default.info("Booking found", { meta: { bookingLength: bookings.length } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, bookings);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function createNewBooking(req, res, next) {
    try {
        logger_1.default.info("Trying to booking", { meta: { user_id: req.body.userId } });
        const data = validationSchema_1.bookingSchema.parse(req.body);
        const sameBooking = await prisma_1.default.booking.findFirst({
            where: {
                turfId: data.turfId,
                date: new Date(data.date)
            }
        });
        if (sameBooking) {
            const sameSlots = sameBooking.slots;
            if (sameSlots.some(slot => slot.from === data.slots[0].from && slot.to === data.slots[0].to)) {
                (0, helper_1.httpsError)(next, new Error("Booking already exists for the given slots"), req, 409);
            }
        }
        const newBooking = await prisma_1.default.booking.create({
            data: {
                ...data,
                date: new Date(data.date)
            }
        });
        logger_1.default.info("Booking created successfully", { meta: { booking_id: newBooking.id } });
        (0, helper_1.httpResponse)(req, res, 201, responseMessage_1.default.success, newBooking);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function updateBooking(req, res, next) {
    try {
        logger_1.default.info("Trying to update booking", { meta: { booking_id: req.body.id } });
        const validation = validationSchema_1.updateBookingSchema.parse(req.body);
        const { id, ...data } = validation;
        const updatedBooking = await prisma_1.default.booking.update({
            where: { id },
            data: {
                ...data,
                date: new Date(data.date)
            }
        });
        logger_1.default.info("Booking updated successfully", { meta: { booking_id: updatedBooking.id } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, updatedBooking);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function getMyBooking(req, res, next) {
    try {
        logger_1.default.info("Trying to get my booking", { meta: { user_id: req.body.id } });
        const { id, from, to } = req.body;
        if (!id) {
            (0, helper_1.httpsError)(next, new Error("Id is required !"), req, 401);
        }
        const bookings = await prisma_1.default.booking.findMany({
            where: {
                userId: id,
                createdAt: {
                    gte: from ? new Date(from) : undefined,
                    lte: to ? new Date(to) : undefined
                },
            },
            include: { turf: true },
            orderBy: { createdAt: "asc" }
        });
        logger_1.default.info("Booking found", { meta: { bookingLength: bookings.length } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, bookings);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
async function getAllSlots(req, res, next) {
    try {
        const { turfId, date } = req.params;
        logger_1.default.info("Trying to get all slots", { meta: { turfId, date } });
        if (!turfId || !date) {
            (0, helper_1.httpsError)(next, new Error("TurfId and date are required !"), req, 404);
            return;
        }
        const parsedDate = new Date(date);
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(13, 59, 59, 999));
        const turf = await prisma_1.default.turf.findUnique({ where: { id: Number(turfId) } });
        if (!turf) {
            (0, helper_1.httpsError)(next, new Error("TurfId and date are required !"), req, 404);
            return;
        }
        const allSlots = turf.slots;
        const bookings = await prisma_1.default.booking.findMany({
            where: {
                turfId: Number(turfId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
        const bookedSlotTimes = bookings.flatMap(booking => {
            const slots = booking.slots;
            return slots.map(slot => ({
                from: slot.from,
                to: slot.to
            }));
        });
        const availableSlots = allSlots.filter(slot => !bookedSlotTimes.some(bookedSlot => bookedSlot.from === slot.from && bookedSlot.to === slot.to));
        logger_1.default.info("Slots found", { meta: { slotLength: availableSlots.length } });
        (0, helper_1.httpResponse)(req, res, 200, responseMessage_1.default.success, availableSlots);
    }
    catch (error) {
        (0, helper_1.httpsError)(next, error, req);
    }
}
exports.default = {
    getAllBooking,
    createNewBooking,
    updateBooking,
    getMyBooking,
    getAllSlots,
};
