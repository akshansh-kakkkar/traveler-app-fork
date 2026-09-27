import { trpcClient } from "@/utils/trpc";
import { enqueueSyncOperation } from "./sync-queue";
import type { SyncOperation } from "../../../../packages/api/src/sync";
type UpdateTripInput = {
  tripId: string;
  version: number;
	data : {
		name? : string;
		description? : string | null;
		startDate? : string | null;
		endDate? : string | null;
	}
};

export async 	function updateTripWithOfflineSupport({
	tripId,
	version,
	data,
} : UpdateTripInput){
	if(!navigator.onLine){
		const operation :  SyncOperation = {
			id : crypto.randomUUID(),
			type : "update-trip",
			tripId,
			version,
			data,
			createdAt : Date.now(),
		}
		await enqueueSyncOperation(operation)
		return { queued : true }
	}

	return trpcClient.trips.update.mutate({
		id : tripId,
		version,
		...data,
	})
}