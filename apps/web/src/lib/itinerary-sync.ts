import { trpcClient } from "@/utils/trpc";
import { enqueueSyncOperation } from "./sync-queue";

type UpdateItineraryItemInput = {
  itemId: string;
  version: number;
  data: {
    title?: string;
    notes?: string | null;
    placeId?: string | null;
    startAt?: string | null;
    endAt?: string | null;
    done?: boolean;
  };
};

export async function updateItineraryItemWIthOfflineSupport({
  itemId,
  version,
  data,
}: UpdateItineraryItemInput) {
  if (!navigator.onLine) {
    await enqueueSyncOperation({
      id: crypto.randomUUID(),
      type: "update-itinerary-item",
      itemId,
      version,
      data,
      createdAt: Date.now(),
    });

    return { queued: true };
  }

  return trpcClient.itinerary.update.mutate({
    id: itemId,
    version,
    ...data,
  });
}
