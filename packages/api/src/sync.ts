export type SyncOperation =
	| {
			id: string;
			type: "update-trip";
			tripId: string;
			version: number;
			data: {
				name?: string;
				description?: string | null;
				startDate?: string | null;
				endDate?: string | null;
			};
			createdAt: number;
			status?: "pending" | "conflict";
			serverVersion?: number | null;
	  }
	| {
			id: string;
			type: "update-itinerary-item";
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
			createdAt: number;
			status?: "pending" | "conflict";
			serverVersion?: number | null;
	  };
