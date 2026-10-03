import prisma from "@traveler-app/db";
import { canEditTrip } from "../trips/trip.permissions";

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

	const item = await prisma.$transaction(async (tx) => {
		const lastItem = await tx.itineraryItem.findFirst({
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

		const createdItem = await tx.itineraryItem.create({
			data: {
				tripId: data.tripId,
				title: data.title,
				notes: data.notes,
				startAt: data.startAt,
				endAt: data.endAt,
				placeId: data.placeId,
				position,
			},
		});

		await tx.trip.update({
			where: {
				id: data.tripId,
			},
			data: {
				version: {
					increment: 1,
				},
			},
		});

		return createdItem;
	});

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
			position: "asc",
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
			tripId: true,
			version: true,
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

	const result = await prisma.$transaction(async (tx) => {
		const updated = await tx.itineraryItem.updateMany({
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

		if (updated.count === 0) {
			return null;
		}
		await tx.trip.update({
			where: {
				id: item.tripId,
			},
			data: {
				version: {
					increment: 1,
				},
			},
		});

		return tx.itineraryItem.findUnique({
			where: {
				id: itemId,
			},
		});
	});

	if (!result) {
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
			tripId: true,
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
			where: {
				id: item.tripId,
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
	const uniqueItemIds = new Set(itemIds);

	if (uniqueItemIds.size !== itemIds.length) {
		throw new Error("Duplicate item IDs");
	}

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

	const result = await prisma.$transaction(async (tx) => {
		const updatedTrip = await tx.trip.updateMany({
			where: {
				id: tripId,
				version,
			},
			data: {
				version: {
					increment: 1,
				},
			},
		});

		if (updatedTrip.count === 0) {
			return null;
		}

		await Promise.all(
			itemIds.map((itemId, index) =>
				tx.itineraryItem.update({
					where: {
						id: itemId,
					},
					data: {
						position: index,
					},
				}),
			),
		);

		return true;
	});

	if (!result) {
		const currentTrip = await prisma.trip.findUnique({
			where: {
				id: tripId,
			},
			select: {
				version: true,
			},
		});

		return {
			conflict: true,
			serverVersion: currentTrip?.version ?? null,
		};
	}

	return true;
}
