import prisma from "@traveler-app/db";
import { canDeleteTrip, canEditTrip } from "./trip.permissions";

export async function tripService({
  userId,
  data,
}: {
  userId: string;
  data: {
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
  };
}) {
  const lastTripMember = await prisma.tripMember.findFirst({
    where: {
      userId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  const position = lastTripMember ? lastTripMember.position + 1 : 0;

  const trip = await prisma.trip.create({
    data: {
      ownerId: userId,
      name: data.name,
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,

      members: {
        create: {
          userId,
          role: "owner",
          position,
        },
      },
    },
  });

  return trip;
}

export async function getTripsService({ userId }: { userId: string }) {
  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return trips;
}

export async function getTripService({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
  });
  return trip;
}

export async function updateTripService({
  userId,
  tripId,
  data,
}: {
  userId: string;
  tripId: string;
  data: {
    name?: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    version: number;
  };
}) {
  const membership = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });

  if (!membership || !canEditTrip(membership.role)) {
    return null;
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    select: {
      version: true,
    },
  });

  if (!trip) {
    return null;
  }

  if (trip.version !== data.version) {
    return {
      conflict: true,
      serverVersion: trip.version,
    };
  }

  const result = await prisma.trip.updateMany({
    where: {
      id: tripId,
      version: data.version,
    },
    data: {
      name: data.name,
      description: data.description,
      startDate: data.startDate
        ? new Date(data.startDate)
        : data.startDate === null
        ? null
        : undefined,
      endDate: data.endDate
        ? new Date(data.endDate)
        : data.endDate === null
        ? null
        : undefined,

      version: {
        increment: 1,
      },
    },
  });

  if (result.count === 0) {
    const currentTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    return {
      conflict: true,
      serverVersion: currentTrip?.version ?? null,
    };
  }

  return prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });
}

export async function deleteTripService({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const membership = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });

  if (!membership || !canDeleteTrip(membership.role)) {
    return null;
  }

  const deletedTrip = await prisma.trip.delete({
    where: {
      id: tripId,
    },
  });

  return deletedTrip;
}

export async function reorderTripsService({
  userId,
  tripIds,
}: {
  userId: string;
  tripIds: string[];
}) {
  const memberships = await prisma.tripMember.findMany({
    where: {
      userId,
      tripId: {
        in: tripIds,
      },
    },
    select: {
      tripId: true,
    },
  });

  const userTripIds = new Set(
    memberships.map((membership) => membership.tripId)
  );

  if (userTripIds.size !== tripIds.length) {
    throw new Error("Invalid trip list");
  }

  await prisma.$transaction(
    tripIds.map((tripId, index) =>
      prisma.tripMember.update({
        where: {
          tripId_userId: {
            tripId,
            userId,
          },
        },
        data: {
          position: index,
        },
      })
    )
  );

  return true;
}
