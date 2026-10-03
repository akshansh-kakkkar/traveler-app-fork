import {
	getTripMembersService,
	removeTripMemberService,
	updateTripMemberRoleService,
} from "./trip-member.service";

export async function updatetripMemberController({
	userId,
	tripId,
	targetUserId,
	role,
}: {
	userId: string;
	tripId: string;
	targetUserId: string;
	role: "viewer" | "editor";
}) {
	return updateTripMemberRoleService({ userId, tripId, targetUserId, role });
}

export async function getTripMemberController({
	userId,
	tripId,
}: {
	userId: string;
	tripId: string;
}) {
	return getTripMembersService({ userId, tripId });
}

export async function removeTripMemberController({
	userId,
	tripId,
	targetUserId,
}: {
	userId: string;
	tripId: string;
	targetUserId: string;
}) {
	return removeTripMemberService({
		userId,
		tripId,
		targetUserId,
	});
}
