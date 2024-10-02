import { z } from "zod";

export const registerUserValidation = z.object({
    email: z.string().email("Invalid Email !"),
    name: z.string().min(3, "The name should at least 3 characters").max(30, "Name can have maximum 30 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    password: z.string().min(8, "Password should be at least 8 characters"),
    confirmPassword: z.string().min(8, "confirmPassword should be at least 8 characters"),
})

export const registerUserValidationSchema = registerUserValidation.refine(data => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword']
})

export const adminRegistrationValidationSchema = registerUserValidation.extend({
    userType: z.enum(["USER", "ADMIN"])
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword']
})

export const loginUserValidationSchema = z.object({
    email: z.string().email("Invalid Email!"),
    password: z.string().min(8, "Password should be at least 8 characters"),
})


const slotSchema = z.object({
    from: z.string().regex(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][Mm]$/, 'Invalid time format for "from"'),
    to: z.string().regex(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][Mm]$/, 'Invalid time format for "to"'),
}); // accept value like (09:30 AM),(01:00)

export const turfSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, "Description is required"),
    type: z.enum(['TURF', 'GROUND']),
    area: z.number().positive('Area must be a positive number'),
    location: z.string().min(1, 'Location is required'),
    pricePerPerson: z.number().positive('Price must be a positive number'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    slots: z.array(slotSchema).min(1, 'At least one slot is required'),
    images: z.array(z.string()).min(1, "Minimum 1 image is required"),
});

export const updateTurfSchema = turfSchema.extend({
    id: z.number().min(1, 'ID is required')
})


export const bookingSchema = z.object({
    turfId: z.number().int().positive(), // Ensure turf_id is a positive integer
    date: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }), // Validate date is a valid ISO date string
    slots: z.array(slotSchema), // Adjust this if you have specific slot structure
    numberOfMembers: z.number().int().positive(), // Ensure number_of_members is a positive integer
    userId: z.number().int().positive(), // Ensure user_id is a positive integer
    pricePerMember: z.number().positive(), // Ensure price_per_member is a positive number
    totalPrice: z.number().positive(), // Ensure total_price is a positive number
    status: z.enum(['BOOKED', 'MAINTENANCE', 'CANCELLED']), // Ensure status is either 'BOOKED' or 'MAINTENANCE'
});

export const updateBookingSchema = bookingSchema.extend({
    // adminId: z.number().int().positive(),
    id: z.number().int().positive(),
})