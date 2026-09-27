import { SyncOperation } from "@traveler-app/api/sync";
import { useEffect, useState } from "react";
import { getSyncConflicts } from "./sync-queue";

export function useSyncConflicts(){
	const [conflicts, setConflicts] = useState<SyncOperation[]>([]);
	
	async function refresh(){
		const result = await getSyncConflicts();
		setConflicts(result);
	}

	useEffect(()=>{
		void refresh();
	}, []);

	return {
		conflicts,
		refresh,
	}
}