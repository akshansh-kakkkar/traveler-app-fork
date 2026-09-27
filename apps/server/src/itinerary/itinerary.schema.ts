import z from "zod";

export const createItineraryItemSchema = z.object({
	tripId : z.string().min(1),
	title : z.string().trim().min(1).max(200),
	notes : z.string().trim().max(2000).optional(),
	placeId : z.string().min(1).optional(),
	startAt : z.coerce.date().optional(),
	endAt : z.coerce.date().optional(),
})

export const ItineraryItemIdSchema = z.object({
	id : z.string().min(1),
})

export const reorderItineraryItemsSchema = z.object({
	tripId : z.string().min(1),
	itemIds : z.array(z.string().min(1)).min(1),
	version : z.number().int().positive(),
})

export const updateItineraryItemSchema = z.object({
	id : z.string().min(1),
	title : z.string().trim().min(1).max(200).optional(),
	notes : z.string().trim().max(2000),
	placeId : z.string().min(1).nullable().optional(),
	startAt : z.coerce.date().nullable().optional(),
	endAt : z.coerce.date().nullable().optional(),
	done : z.boolean().optional(),
	version : z.number().int().positive(),
})
