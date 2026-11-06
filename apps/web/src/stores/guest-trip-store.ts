
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GuestTrip {
	id : string;
	name : string;
	description?: string;
	startDate?: string;
	endDate?: string;
}

interface GuestTripState {
	trip : GuestTrip | null;
	hasCreatedItinerary : boolean;
	setTrip : (trip : GuestTrip) => void;
	clearTrip : ()=> void;
	markItineraryCreated : ()=>void;
}

export const useGuestTripStore = create<GuestTripState>()(
	persist(
		(set) => ({
			trip: null,
			hasCreatedItinerary : false,
			setTrip : (trip) => set({ trip }),

			clearTrip : ()=>set({
				trip : null,
				hasCreatedItinerary : false,
			}),
			markItineraryCreated : ()=> set({ hasCreatedItinerary : true }),
		}),
		
		{
			name : "traveler-guest-trip",
			storage : createJSONStorage(()=> localStorage)
		}
		
	),
	
)