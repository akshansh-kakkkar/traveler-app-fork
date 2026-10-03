import prisma, { PlaceCategory } from "@traveler-app/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../index";
import { generateItinerary } from "../services/itinerary/generate";

const MAX_GENERATIONS_PER_HOUR = 5;
const KL_UTC_OFFSET = "+08:00";

export const generateItineraryProcedure = protectedProcedure
	.input(
		z.object({
			cityId: z.string().default("kl"),
			interests: z.array(z.enum(PlaceCategory)).min(1).max(6),
			days: z.number().int().min(1).max(7),
			pace: z.enum(["relaxed", "normal", "packed"]).optional(),
			notes: z.string().trim().max(500).optional(),
			startDate: z.coerce.date().optional(),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.session.user.id;

		// PRD AI6: generation costs LLM quota so cap it per user
		const recent = await prisma.trip.count({
			where: {
				ownerId: userId,
				createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
			},
		});
		if (recent >= MAX_GENERATIONS_PER_HOUR) {
			throw new TRPCError({
				code: "TOO_MANY_REQUESTS",
				message: `Limit is ${MAX_GENERATIONS_PER_HOUR} trips per hour`,
			});
		}

		const generated = await generateItinerary({
			cityId: input.cityId,
			interests: input.interests,
			days: input.days,
			pace: input.pace,
			notes: input.notes,
		}).catch((error: unknown) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Could not generate an itinerary. Please try again.",
				cause: error,
			});
		});

		let position = 0;
		const items = generated.days.flatMap((day) =>
			day.items.map((item) => {
				const startAt = toTimestamp(input.startDate, day.day, item.startTime);
				return {
					title: item.place.name,
					notes: item.reason,
					placeId: item.place.id,
					startAt,
					endAt: startAt
						? new Date(startAt.getTime() + item.durationMin * 60 * 1000)
						: null,
					position: position++,
				};
			}),
		);

		const endDate = input.startDate
			? new Date(input.startDate.getTime() + (input.days - 1) * 86_400_000)
			: null;

		return prisma.trip.create({
			data: {
				name: `${input.days} days in Kuala Lumpur`,
				ownerId: userId,
				startDate: input.startDate ?? null,
				endDate,
				members: { create: { userId, role: "owner" } },
				items: { create: items },
			},
			include: {
				items: { include: { place: true }, orderBy: { position: "asc" } },
			},
		});
	});

function toTimestamp(
	startDate: Date | undefined,
	dayNumber: number,
	time: string,
): Date | null {
	if (!startDate) return null;

	const date = new Date(startDate.getTime() + (dayNumber - 1) * 86_400_000);
	const isoDate = date.toISOString().slice(0, 10);
	return new Date(`${isoDate}T${time}:00${KL_UTC_OFFSET}`);
}
