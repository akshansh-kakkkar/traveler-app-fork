import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_GAP = 12;

export function useTabBarSpace() {
	const insets = useSafeAreaInsets();
	return TAB_BAR_HEIGHT + TAB_BAR_GAP * 2 + insets.bottom;
}
