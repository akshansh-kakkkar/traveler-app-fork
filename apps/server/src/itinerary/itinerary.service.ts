import { canEditTrip } from "@/trips/trip.permissions";
import prisma from "@traveler-app/db";

export async function createItineraryItemService({
  userId,
  data,
}: {
  userId: string;
  data: {
    tripId: string;
    title: string;
    notes?: string;
    placeId?: string;
    startAt?: Date;
    endAt?: Date;
  };
}) {
  const membership = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId: data.tripId,
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

  const lastItem = await prisma.itineraryItem.findFirst({
    where: {
      tripId: data.tripId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });
  const position = lastItem ? lastItem.position + 1 : 0;

  const [item] = await prisma.$transaction([
    prisma.itineraryItem.create({
      data: {
        tripId: data.tripId,
        title: data.title,
        notes: data.notes,
        startAt: data.startAt,
        endAt: data.endAt,
        placeId: data.placeId,
        position,
      },
    }),

    prisma.trip.update({
      where: {
        id: data.tripId,
      },
      data: {
        version: {
          increment: 1,
        },
      },
    }),
  ]);

  return item;
}

export async function getItineraryItemServices({
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
    select: {
      id: true,
    },
  });

  if (!trip) {
    return null;
  }

  const items = await prisma.itineraryItem.findMany({
    where: {
      tripId,
    },
    orderBy: {
      position: "desc",
    },
  });
  return items;
}

export async function getItineraryItemService({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
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
    },
  });
  return item;
}

export async function updateItineraryItemService({
  userId,
  itemId,
  data,
}: {
  userId: string;
  itemId: string;
  data: {
    title?: string;
    notes?: string | null;
    placeId?: string | null;
    startAt?: Date | null;
    endAt?: Date | null;
    done?: boolean;
    version: number;
  };
}) {
  const item = await prisma.itineraryItem.findFirst({
		where : {
			id : itemId,
			trip : {
				OR : [
					{
						ownerId : userId,
					},
					{
						members : {
							some : {
								userId,
								role : 'editor',
							},
						},
					},
				],
			},
		},
		select : {
			id : true,
			tripId : true,
			version : true
		},
  });

  if (!item) {
    return null;
  }

  if (item.version !== data.version) {
    return {
      conflict: true,
      serverVersion: item.version,
    };
  }

  const result = await prisma.itineraryItem.updateMany({
    where: {
      id: itemId,
      version: data.version,
    },
    data: {
      title: data.title,
      notes: data.notes,
      startAt: data.startAt,
      endAt: data.endAt,
      placeId: data.placeId,
      done: data.done,
      version: {
        increment: 1,
      },
    },
  });

  if (result.count === 0) {
    const currentItem = await prisma.itineraryItem.findUnique({
      where: {
        id: itemId,
      },
      select: {
        version: true,
      },
    });

    return {
      conflict: true,
      serverVersion: currentItem?.version ?? null,
    };
  }

	await prisma.trip.update({
		where : {
			id : item.tripId,
		},
		data : {
			version : {
				increment : 1,
			},
		},
	});

  return prisma.itineraryItem.findUnique({
    where: {
      id: itemId,
    },
  });
}

export async function deleteItineraryItemService({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
                role: "editor",
              },
            },
          },
        ],
      },
    },
    select: {
      id: true,
			tripId : true,
    },
  });

  if (!item) return null;

  await prisma.$transaction([
    prisma.itineraryItem.delete({
      where: {
        id: item.id,
      },
    }),

		prisma.trip.update({
			where : {
				id : item.tripId
			},
			data : {
				version : {
					increment : 1
				}
			}
		})
  ]);

  return true;
}

export async function reorderItineraryItemsService({
  userId,
  tripId,
  itemIds,
  version,
}: {
  userId: string;
  tripId: string;
  itemIds: string[];
  version: number;
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
              role: { in: ["owner", "editor"] },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      version: true,
    },
  });

  if (!trip) return null;

  if (trip.version !== version) {
    return {
      conflict: true,
      serverVersion: trip.version,
    };
  }
  const items = await prisma.itineraryItem.findMany({
    where: {
      tripId,
      id: { in: itemIds },
    },
    select: {
      id: true,
    },
  });

  if (items.length !== itemIds.length) {
    throw new Error("Invalid item list");
  }

  await prisma.$transaction([
    ...itemIds.map((itemId, index) =>
      prisma.itineraryItem.update({
        where: {
          id: itemId,
        },
        data: {
          position: index,
        },
      })
    ),
    prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        version: {
          increment: 1,
        },
      },
    }),
  ]);

  return true;
}
