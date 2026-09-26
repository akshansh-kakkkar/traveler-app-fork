import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "@traveler-app/env/server";

import { PrismaClient } from "../prisma/generated/client";

export type { Place } from "../prisma/generated/client";
export * from "../prisma/generated/enums";
export type * from "../prisma/generated/models";

export function createPrismaClient() {
	const adapter = new PrismaNeon({
		connectionString: env.DATABASE_URL,
	});

	return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();
export default prisma;
