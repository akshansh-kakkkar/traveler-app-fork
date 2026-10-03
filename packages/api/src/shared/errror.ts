import { TRPCError } from "@trpc/server";

export function throwConflict(serverVersion: number) {
	throw new TRPCError({
		code: "CONFLICT",
		message: "This data was changed by someone else.",
		cause: {
			serverVersion,
		},
	});
}
