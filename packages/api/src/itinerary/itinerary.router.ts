import { protectedProcedure, t } from "../index";
import { tripIdSchema } from "../trips/trip.schema";
import {
	createItineraryController,
	deleteItineraryItemController,
	getItineraryItemController,
	getItineraryItemsController,
	reorderItineraryController,
	updateItineraryItemController,
} from "./itinerary.controller";
import { generateItineraryProcedure } from "./itinerary.generate";
import {
	createItineraryItemSchema,
	ItineraryItemIdSchema,
	reorderItineraryItemsSchema,
	updateItineraryItemSchema,
} from "./itinerary.schema";

export const itineraryRouter = t.router({
	create: protectedProcedure
		.input(createItineraryItemSchema)
		.mutation(async ({ ctx, input }) => {
			return createItineraryController({
				userId: ctx.user.id,
				data: input,
			});
		}),
	getAll: protectedProcedure
		.input(tripIdSchema)
		.query(async ({ input, ctx }) => {
			return getItineraryItemsController({
				userId: ctx.user.id,
				tripId: input.id,
			});
		}),
	getOne: protectedProcedure
		.input(ItineraryItemIdSchema)
		.query(async ({ input, ctx }) => {
			return getItineraryItemController({
				userId: ctx.user.id,
				itemId: input.id,
			});
		}),

	update: protectedProcedure
		.input(updateItineraryItemSchema)
		.mutation(async ({ input, ctx }) => {
			return updateItineraryItemController({
				userId: ctx.user.id,
				itemId: input.id,
				data: {
					title: input.title,
					placeId: input.placeId,
					notes: input.notes,
					endAt: input.endAt,
					startAt: input.startAt,
					done: input.done,
					version: input.version,
				},
			});
		}),
	delete: protectedProcedure
		.input(ItineraryItemIdSchema)
		.mutation(async ({ input, ctx }) => {
			return deleteItineraryItemController({
				userId: ctx.user.id,
				itemId: input.id,
			});
		}),

	reorder: protectedProcedure
		.input(reorderItineraryItemsSchema)
		.mutation(async ({ input, ctx }) => {
			return reorderItineraryController({
				userId: ctx.user.id,
				tripId: input.tripId,
				itemIds: input.itemIds,
				version: input.version,
			});
		}),

	generate: generateItineraryProcedure,
});
