import { trpcClient } from "@/utils/trpc";
import { getSyncOperations, removeSyncOperation } from "./sync-queue";

export async function processSyncQueue() {
  const operations = await getSyncOperations();

  for (const operation of operations) {
    try {
      switch (operation.type) {
        case "update-trip":
          const result = await trpcClient.trips.update.mutate({
            id: operation.tripId,
            version: operation.version,
            ...operation.data,
          });

          if (result && "conflict" in result && result.conflict) {
            console.warn("Trip sync conflict:", result);
            break;
          }
          await removeSyncOperation(operation.id);
          break;

        case "update-itinerary-item": {
          const result = await trpcClient.itinerary.update.mutate({
            id: operation.itemId,
            version: operation.version,
            ...operation.data,
          });

          if (result && "conflict" in result && result.conflict) {
            console.warn("Itinerary sync conflict:", result);
            break;
          }
          await removeSyncOperation(operation.id);
          break;
        }
      }
    } catch (error) {
      console.error("Sync failed:", error);

      break;
    }
  }
}
