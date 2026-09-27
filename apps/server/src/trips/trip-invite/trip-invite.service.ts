import prisma from "@traveler-app/db";
import { randomBytes } from "node:crypto";
export async function createTripInviteService({
  userId,
  tripId,
  expiresAt,
}: {
  userId: string;
  tripId: string;
  expiresAt?: Date;
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

  if (membership?.role !== "owner") {
    return null;
  }

  const token = randomBytes(32).toString("hex");
const invite = await prisma.tripInvite.create({
		data :{
			tripId,
			createdById : userId,
			token,
			expiresAt,
		},
	});

	return {
		token : invite.token,
		inviteUrl : `/invite/${invite.token}`,
	}
}

export async function acceptTripInviteService({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const invite = await prisma.tripInvite.findUnique({
    where: {
      token,
    },
  });

  if (!invite) {
    return null;
  }

	const trip = await prisma.trip.findUnique({
		where : {
			id : invite.tripId,
		},
		select : {
			ownerId : true,
		}
	});

	if(!trip){
		return null
	}

	if(trip.ownerId === userId){
		return null;
	}

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return null;
  }

  const existingMember = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId: invite.tripId,
        userId,
      },
    },
  });

  if (existingMember) {
    return existingMember;
  }

  return prisma.tripMember.create({
    data: {
      tripId: invite.tripId,
      userId,
      role: "viewer",
    },
  });
}

export async function deleteTripInviteService({
	userId,
	token
} : {
	userId : string,
	token : string,
}){
	const invite = await prisma.tripInvite.findUnique({
		where : {
			token,
		},
		select : {
			id : true,
			tripId : true,
		},
	});

	if(!invite){
		return null;
	}

	const memberShip = await prisma.tripMember.findUnique({
		where : {
			tripId_userId : {
				tripId : invite.tripId,
				userId,
			},
		},
		select : {
			role : true,
		},
	});

	if(memberShip?.role !== "owner"){
		return null;
	}

	await prisma.tripInvite.delete({
		where : {
			id : invite.id,
		},
	});

	return true
}

export async function getTripInvitesService({
	userId,
	tripId,
} : {
	userId : string,
	tripId : string,
}){
	const membership = await prisma.tripMember.findUnique({
		where : {
			tripId_userId : {
				tripId,
				userId,
			},
		},

		select : {
			role : true,
		},
	});

	if(membership?.role !== "owner"){
		return null;
	}

	return prisma.tripInvite.findMany({
		where : {
			tripId, 
			OR : [
				{
					expiresAt : null,
				},
				{
					expiresAt : {
						gt : new Date(),
					}
				},
			],
		},
		select : {
			id : true,
			token : true,
			expiresAt : true,
			createdAt : true,
		},
		orderBy : {
			createdAt : "desc",
		}
	})
}