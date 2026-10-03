import { protectedProcedure, publicProcedure, router } from "../index";
import { itineraryRouter } from "../itinerary/itinerary.router";
import { tripRouter } from "../trips/trip.router";
import { tripInviteRouter } from "../trips/trip-invite/trip-invite.router";
import { tripMemberRouter } from "../trips/trip-member/trip-member.router";
import { placeRouter } from "./place";

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
	place: placeRouter,
	trips: tripRouter,
	members: tripMemberRouter,
	invites: tripInviteRouter,
	itinerary: itineraryRouter,
});
export type AppRouter = typeof appRouter;
