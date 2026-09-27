import { processSyncQueue } from "./sync-processor";

let listening = false;

export function startSyncListener(){
	if(listening || typeof window === "undefined"){
		return;
	}

	listening = true;

	window.addEventListener("online", ()=>{
		void processSyncQueue();
	});

	if(navigator.onLine){
		void processSyncQueue();
	}
}