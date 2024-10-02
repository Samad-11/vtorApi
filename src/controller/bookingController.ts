import { NextFunction, Request, Response } from "express";
import { httpResponse, httpsError } from "../utils/helper";
import prisma from "../utils/prisma";
import responseMessage from "../constant/responseMessage";
import { bookingSchema, updateBookingSchema } from "../utils/validationSchema";
import logger from "../utils/logger";

async function getAllBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const { from, to } = req.query as { from: string, to: string }
        logger.info("Trying to get all booking", { meta: { from, to } })

        const bookings = await prisma.booking.findMany({
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
        })
        logger.info("Booking found", { meta: { bookingLength: bookings.length } })
        httpResponse(req, res, 200, responseMessage.success, bookings)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function createNewBooking(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to booking", { meta: { user_id: req.body.userId } })
        const data = bookingSchema.parse(req.body)


        const sameBooking = await prisma.booking.findFirst({
            where: {
                turfId: data.turfId,
                date: new Date(data.date)
            }
        })
        if (sameBooking) {
            const sameSlots = sameBooking.slots as { from: string, to: string }[]
            if (sameSlots.some(slot => slot.from === data.slots[0].from && slot.to === data.slots[0].to)) {
                httpsError(next, new Error("Booking already exists for the given slots"), req, 409)
            }
        }


        const newBooking = await prisma.booking.create({
            data: {
                ...data,
                date: new Date(data.date)
            }
        })
        logger.info("Booking created successfully", { meta: { booking_id: newBooking.id } })
        httpResponse(req, res, 201, responseMessage.success, newBooking)
    } catch (error) {
        httpsError(next, error, req)
    }
}

async function updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to update booking", { meta: { booking_id: req.body.id } })
        const validation = updateBookingSchema.parse(req.body)
        const { id, ...data } = validation

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                ...data,
                date: new Date(data.date)
            }
        })
        logger.info("Booking updated successfully", { meta: { booking_id: updatedBooking.id } })
        httpResponse(req, res, 200, responseMessage.success, updatedBooking)

    } catch (error) {
        httpsError(next, error, req)
    }
}

async function getMyBooking(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info("Trying to get my booking", { meta: { user_id: req.body.id } })
        const { id, from, to } = req.body;
        if (!id) {
            httpsError(next, new Error("Id is required !"), req, 401)
        }
        const bookings = await prisma.booking.findMany({
            where: {
                userId: id,
                createdAt: {
                    gte: from ? new Date(from) : undefined,
                    lte: to ? new Date(to) : undefined
                },
            },
            include: { turf: true },
            orderBy: { createdAt: "asc" }
        })
        logger.info("Booking found", { meta: { bookingLength: bookings.length } })
        httpResponse(req, res, 200, responseMessage.success, bookings)
    } catch (error) {
        httpsError(next, error, req)
    }
}


async function getAllSlots(req: Request, res: Response, next: NextFunction) {
    try {
        const { turfId, date } = req.params
        logger.info("Trying to get all slots", { meta: { turfId, date } })
        if (!turfId || !date) {
            httpsError(next, new Error("TurfId and date are required !"), req, 404)
            return
        }
        const parsedDate = new Date(date)
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0))
        const endOfDay = new Date(parsedDate.setHours(13, 59, 59, 999))

        const turf = await prisma.turf.findUnique({ where: { id: Number(turfId) } })
        if (!turf) {
            httpsError(next, new Error("TurfId and date are required !"), req, 404)
            return
        }

        const allSlots = turf.slots as { from: string, to: string }[]

        const bookings = await prisma.booking.findMany({
            where: {
                turfId: Number(turfId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })

        const bookedSlotTimes = bookings.flatMap(booking => {
            const slots = booking.slots as { from: string, to: string }[]
            return slots.map(slot => ({
                from: slot.from,
                to: slot.to
            }))
        })

        const availableSlots = allSlots.filter(slot =>
            !bookedSlotTimes.some(
                bookedSlot =>
                    bookedSlot.from === slot.from && bookedSlot.to === slot.to
            )
        )
        logger.info("Slots found", { meta: { slotLength: availableSlots.length } })
        httpResponse(req, res, 200, responseMessage.success, availableSlots)
    } catch (error) {
        httpsError(next, error, req)
    }

}
export default {
    getAllBooking,
    createNewBooking,
    updateBooking,
    getMyBooking,
    getAllSlots,
}