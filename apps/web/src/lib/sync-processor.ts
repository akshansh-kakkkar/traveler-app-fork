import { trpcClient } from "@/utils/trpc";
import { getSyncOperations, removeSyncOperation } from "./sync-queue";
import { appRouter } from "@traveler-app/api/routers/index";

export async function processSyncQueue() {
  const operations = await getSyncOperations();
  for (const operation of operations) {
    try {
      switch (operation.type) {
        case "update-trip":
          await trpcClient.trips.update.mutate({
            id: operation.tripId,
            version: operation.version,
            ...operation.data,
          });
          break;

        case "update-itinerary-item":
          await trpcClient.itinerary.update.mutate({
            id: operation.itemId,
            version: operation.version,
            ...operation.data,
          });
          break;
      }
      await removeSyncOperation(operation.id);
    } catch (error) {
      console.error("Sync failed:", error);

      break;
    }
  }
}
