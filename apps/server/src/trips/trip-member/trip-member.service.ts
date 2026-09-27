import prisma from "@traveler-app/db";

export async function updateTripMemberRoleService({
  userId,
  tripId,
  targetUserId,
  role,
}: {
  userId: string;
  tripId: string;
  targetUserId: string;
  role: "editor" | "viewer";
}) {
  const ownerMemberShipRole = await prisma.tripMember.findUnique({
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

  if (ownerMemberShipRole?.role !== "owner") {
    return null;
  }

  const updateMember = await prisma.tripMember.update({
    where: {
      tripId_userId: {
        tripId,
        userId: targetUserId,
      },
    },
    data: {
      role,
    },
  });

  return updateMember;
}

export async function getTripMembersService({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const member = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!member) {
    return null;
  }

  const members = await prisma.tripMember.findMany({
    where: {
      tripId,
    },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return members;
}

export async function removeTripMemberService({
  userId,
  tripId,
  targetUserId,
}: {
  userId: string;
  tripId: string;
  targetUserId: string;
}) {
  const owner = await prisma.tripMember.findUnique({
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

  if (owner?.role !== "owner") {
    return null;
  }
  if (userId === targetUserId) {
    throw new Error("owner cannot remove themselves.");
  }

  const member = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId: targetUserId,
      },
    },
  });

  if (!member) {
    return null;
  }

  await prisma.tripMember.delete({
    where: {
      tripId_userId: {
        tripId,
        userId: targetUserId,
      },
    },
  });
  return true;
}
