"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = exports.bookingSchema = exports.updateTurfSchema = exports.turfSchema = exports.loginUserValidationSchema = exports.adminRegistrationValidationSchema = exports.registerUserValidationSchema = exports.registerUserValidation = void 0;
const zod_1 = require("zod");
exports.registerUserValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid Email !"),
    name: zod_1.z.string().min(3, "The name should at least 3 characters").max(30, "Name can have maximum 30 characters"),
    phone: zod_1.z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    password: zod_1.z.string().min(8, "Password should be at least 8 characters"),
    confirmPassword: zod_1.z.string().min(8, "confirmPassword should be at least 8 characters"),
});
exports.registerUserValidationSchema = exports.registerUserValidation.refine(data => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword']
});
exports.adminRegistrationValidationSchema = exports.registerUserValidation.extend({
    userType: zod_1.z.enum(["USER", "ADMIN"])
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword']
});
exports.loginUserValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid Email!"),
    password: zod_1.z.string().min(8, "Password should be at least 8 characters"),
});
const slotSchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][Mm]$/, 'Invalid time format for "from"'),
    to: zod_1.z.string().regex(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][Mm]$/, 'Invalid time format for "to"'),
}); // accept value like (09:30 AM),(01:00)
exports.turfSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().min(1, "Description is required"),
    type: zod_1.z.enum(['TURF', 'GROUND']),
    area: zod_1.z.number().positive('Area must be a positive number'),
    location: zod_1.z.string().min(1, 'Location is required'),
    pricePerPerson: zod_1.z.number().positive('Price must be a positive number'),
    capacity: zod_1.z.number().int().positive('Capacity must be a positive integer'),
    slots: zod_1.z.array(slotSchema).min(1, 'At least one slot is required'),
    images: zod_1.z.array(zod_1.z.string()).min(1, "Minimum 1 image is required"),
});
exports.updateTurfSchema = exports.turfSchema.extend({
    id: zod_1.z.number().min(1, 'ID is required')
});
exports.bookingSchema = zod_1.z.object({
    turfId: zod_1.z.number().int().positive(), // Ensure turf_id is a positive integer
    date: zod_1.z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }), // Validate date is a valid ISO date string
    slots: zod_1.z.array(slotSchema), // Adjust this if you have specific slot structure
    numberOfMembers: zod_1.z.number().int().positive(), // Ensure number_of_members is a positive integer
    userId: zod_1.z.number().int().positive(), // Ensure user_id is a positive integer
    pricePerMember: zod_1.z.number().positive(), // Ensure price_per_member is a positive number
    totalPrice: zod_1.z.number().positive(), // Ensure total_price is a positive number
    status: zod_1.z.enum(['BOOKED', 'MAINTENANCE', 'CANCELLED']), // Ensure status is either 'BOOKED' or 'MAINTENANCE'
});
exports.updateBookingSchema = exports.bookingSchema.extend({
    // adminId: z.number().int().positive(),
    id: zod_1.z.number().int().positive(),
});
