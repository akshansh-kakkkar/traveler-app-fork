import type { TripMemberRole } from "../../../../packages/db/prisma/generated/enums";

export function canEditTrip(role: TripMemberRole) {
  return role === "owner" || role === "editor";
}

export function canDeleteTrip(role: TripMemberRole) {
  return (role = "owner");
}

export function canManageMembers(role: TripMemberRole) {
  return role === "owner";
}
