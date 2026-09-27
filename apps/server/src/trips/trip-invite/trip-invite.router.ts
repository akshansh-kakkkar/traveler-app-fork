import { t } from "@/trpc";
import { protectedProcedure } from "@traveler-app/api";
import { acceptTripInviteController, createTripInviteController, deleteTripInviteController, getTripInvitesController } from "./trip-invite.controller";
import { acceptTripInviteSchema, createTripInviteSchema, deleteTripInviteSchema, getTripInviteSchema } from "./trip-invite. schema";

export const tripInviteRouter = t.router({
  create: protectedProcedure
    .input(createTripInviteSchema)
    .mutation(({ ctx, input }) => {
      createTripInviteController({
        userId: ctx.session.user.id,
        tripId: input.tripId,
        expiresAt: input.expiresAt,
      });
    }),

		accept : protectedProcedure.input(acceptTripInviteSchema).mutation(({ctx, input})=>{
			acceptTripInviteController({
				userId : ctx.session.user.id,
				token : input.token
			})
		}),
		delete : protectedProcedure.input(deleteTripInviteSchema).mutation(({ctx, input})=>{
			deleteTripInviteController({
				userId : ctx.session.user.id,
				token : input.token
			})
		}),
		getAll : protectedProcedure.input(getTripInviteSchema).query(({ctx,input})=>{
			getTripInvitesController({
				userId : ctx.session.user.id,
				tripId : input.tripId
			})
		})
});


