import { z } from "zod";

// Shape required from LLM
export const llmItinerarySchema = z.object({
	days: z
		.array(
			z.object({
				day: z.number().int().min(1),
				items: z
					.array(
						z.object({
							placeId: z.string().min(1),
							startTime: z.string().regex(/^\d{2}:\d{2}$/, "expected HH:MM"),
							durationMin: z.number().int().min(15).max(480),
							reason: z.string().max(300).optional(),
						}),
					)
					.min(1),
			}),
		)
		.min(1),
});

export type LlmItinerary = z.infer<typeof llmItinerarySchema>;
