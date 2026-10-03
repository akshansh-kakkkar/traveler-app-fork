import { protectedProcedure, t } from "../index";
import {
	createTripController,
	deleteTripController,
	getTripController,
	getTripsController,
	reorderTripController,
	updateTripController,
} from "./trip.controller";
import {
	createTripSchema,
	reorderTripsSchema,
	tripIdSchema,
	updateTripSchema,
} from "./trip.schema";

export const tripRouter = t.router({
	create: protectedProcedure
		.input(createTripSchema)
		.mutation(async ({ input, ctx }) => {
			return createTripController({
				userId: ctx.user.id,
				data: input,
			});
		}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		return getTripsController({
			userId: ctx.user.id,
		});
	}),
	getOne: protectedProcedure
		.input(tripIdSchema)
		.query(async ({ input, ctx }) => {
			return getTripController({
				userId: ctx.user.id,
				tripId: input.id,
			});
		}),
	update: protectedProcedure
		.input(updateTripSchema)
		.mutation(async ({ input, ctx }) => {
			return updateTripController({
				userId: ctx.user.id,
				tripId: input.id,
				data: {
					name: input.name,
					description: input.description,
					startDate: input.startDate?.toISOString() ?? null,
					endDate: input.endDate?.toISOString() ?? null,
					version: input.version,
				},
			});
		}),
	delete: protectedProcedure
		.input(tripIdSchema)
		.mutation(async ({ input, ctx }) => {
			return deleteTripController({
				userId: ctx.user.id,
				tripId: input.id,
			});
		}),
	reorder: protectedProcedure
		.input(reorderTripsSchema)
		.mutation(async ({ input, ctx }) => {
			return reorderTripController({
				userId: ctx.user.id,
				tripIds: input.tripIds,
			});
		}),
});
