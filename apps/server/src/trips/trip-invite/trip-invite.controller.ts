import {
  acceptTripInviteService,
  deleteTripInviteService,
  getTripInvitesService,
} from "./trip-invite.service";

export async function createTripInviteController({
  userId,
  tripId,
  expiresAt,
}: {
  userId: string;
  tripId: string;
  expiresAt?: Date;
}) {
  return createTripInviteController({
    userId,
    tripId,
    expiresAt,
  });
}

export async function acceptTripInviteController({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  return acceptTripInviteService({ userId, token });
}

export async function deleteTripInviteController({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  return deleteTripInviteService({ userId, token });
}

export async function getTripInvitesController({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  return getTripInvitesService({
    userId,
    tripId,
  });
}
