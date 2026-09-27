import z from "zod";

export const createTripSchema = z.object({
    name : z.string().trim().min(1).max(100),
    description : z.string().trim().max(1000).optional(),
    startDate : z.coerce.date().optional(),
    endDate : z.coerce.date().optional(),
})

export const updateTripSchema = z.object({
    id : z.string().min(1),
    name : z.string().trim().min(1).max(100).optional(),
    description : z.string().trim().max(1000).nullable().optional(),
    startDate : z.coerce.date().nullable().optional(),
    endDate : z.coerce.date().nullable().optional(),
		version : z.number().int().positive(),
})

export const tripIdSchema = z.object({
    id : z.string().min(1),
})

export const reorderTripsSchema = z.object({
	tripIds : z.array(z.string().min(1)).min(1)
})

