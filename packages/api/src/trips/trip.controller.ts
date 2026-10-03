import {
	deleteTripService,
	getTripService,
	getTripsService,
	reorderTripsService,
	tripService,
	updateTripService,
} from "./trip.service";

export async function createTripController({
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
	return tripService({ userId, data });
}

export async function getTripsController({ userId }: { userId: string }) {
	return getTripsService({ userId });
}

export async function getTripController({
	userId,
	tripId,
}: {
	userId: string;
	tripId: string;
}) {
	return getTripService({ userId, tripId });
}

export async function updateTripController({
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
	return updateTripService({ userId, tripId, data });
}

export async function deleteTripController({
	userId,
	tripId,
}: {
	userId: string;
	tripId: string;
}) {
	return deleteTripService({ userId, tripId });
}

export async function reorderTripController({
	userId,
	tripIds,
}: {
	userId: string;
	tripIds: string[];
}) {
	return reorderTripsService({ userId, tripIds });
}
