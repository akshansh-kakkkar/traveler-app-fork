import { protectedProcedure, publicProcedure, router } from "../index";
import { itineraryRouter } from "./itinerary";
import { placeRouter } from "./place";
import { tripRouter } from "./trip";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	trip: tripRouter,
	place: placeRouter,
	itinerary: itineraryRouter,
});
export type AppRouter = typeof appRouter;
