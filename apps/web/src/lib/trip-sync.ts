import { trpcClient } from "@/utils/trpc";
import { enqueueSyncOperation } from "./sync-queue";

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
		await enqueueSyncOperation({
			id : crypto.randomUUID(),
			type : "update-trip",
			tripId,
			version,
			data,
			createdAt : Date.now(),
		});

		return { queued : true }
	}

	return trpcClient.trips.update.mutate({
		id : tripId,
		version,
		...data,
	})
}