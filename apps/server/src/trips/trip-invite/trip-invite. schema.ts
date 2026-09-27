import z from "zod";

export const createTripInviteSchema = z.object({
  tripId: z.string().min(1),
  expiresAt: z.coerce.date().optional(),
});

export const acceptTripInviteSchema = z.object({
  token: z.string().min(1),
});

export const deleteTripInviteSchema = z.object({
  token: z.string().min(1),
});

export const getTripInviteSchema = z.object({
  tripId: z.string().min(1),
});
