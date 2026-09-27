import {
  deleteTripMemberSchema,
  updateTripMemberRoleSchema,
} from "./trip-member.schema";
import { t, protectedProcedure } from "@/trpc";
import {
  getTripMemberController,
  removeTripMemberController,
  updatetripMemberController,
} from "./trip-member.controller";

export const tripMemberRouter = t.router({
  updateTripRouter: protectedProcedure
    .input(updateTripMemberRoleSchema)
    .mutation(({ ctx, input }) =>
      updatetripMemberController({
        userId: ctx.user.id,
        tripId: input.tripId,
        targetUserId: input.targetUserId,
        role: input.role,
      })
    ),

  getTripMembers: protectedProcedure
    .input(updateTripMemberRoleSchema)
    .query(({ ctx, input }) => {
      getTripMemberController({
        userId: ctx.session.user.id,
        tripId: input.tripId,
      });
    }),
  remove: protectedProcedure
    .input(deleteTripMemberSchema)
    .mutation(async ({ input, ctx }) => {
      return removeTripMemberController({
        userId: ctx.user.id,
        tripId: input.tripId,
        targetUserId: input.targetUserId,
      });
    }),
});
