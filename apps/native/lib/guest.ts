import AsyncStorage from "@react-native-async-storage/async-storage";

const GUEST_MODE_KEY = "guest_mode";
export async function enableGuestMode() {
	await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
}

export async function disableGuestMode() {
	await AsyncStorage.removeItem(GUEST_MODE_KEY);
}

export async function isGuestMode() {
	return (await AsyncStorage.getItem(GUEST_MODE_KEY)) === "true";
}
