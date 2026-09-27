import z from "zod";

export const updateTripMemberRoleSchema = z.object({
  tripId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["editor", "viewer"]),
  targetUserId: z.string(),
});

export const deleteTripMemberSchema = z.object({
  tripId: z.string().min(1),
  userId: z.string().min(1),
  targetUserId: z.string(),
});
