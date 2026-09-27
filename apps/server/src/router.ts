import { itineraryRouter } from "./itinerary/itinerary.router";
import { tripInviteRouter } from "./trips/trip-invite/trip-invite.router";
import { tripMemberRouter } from "./trips/trip-member/trip-member.router";
import { tripRouter } from "./trips/trip.router";
import { t } from "./trpc";

export const appRouter = t.router({
  trips: tripRouter,
  itinerary: itineraryRouter,
  members: tripMemberRouter,
  invites: tripInviteRouter,
});

export type AppRouter = typeof appRouter;
