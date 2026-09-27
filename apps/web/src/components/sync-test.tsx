import { updateTripWithOfflineSupport } from "@/lib/trip-sync";

export default function SyncTest() {
  async function testOfflineSync() {
    const result = await updateTripWithOfflineSupport({
      tripId: "PUT_REAL_TRIP_ID_HERE",
      version: 1,
      data: {
        name: "offline Test Trip",
      },
    });
    console.log("Sync test result:", result);
  }

  return <button onClick={testOfflineSync}>Test Offline Sync</button>;
}
