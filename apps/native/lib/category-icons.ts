import type { Ionicons } from "@expo/vector-icons";
import type { PlaceCategory } from "@traveler-app/db/enums";

type IconName = keyof typeof Ionicons.glyphMap;

export const CATEGORY_ICONS: Record<PlaceCategory, IconName> = {
	food: "fast-food",
	culture: "color-palette",
	nature: "leaf",
	shopping: "bag",
	nightlife: "moon",
	attraction: "camera",
};
