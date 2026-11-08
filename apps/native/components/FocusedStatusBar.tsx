import { useIsFocused } from "expo-router";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";

// Overrides the app's dark status bar only while this screen is on top,
// e.g. light icons over a dark header.
export function FocusedStatusBar({ style }: { style: StatusBarStyle }) {
	const isFocused = useIsFocused();
	return isFocused ? <StatusBar style={style} /> : null;
}
