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

export const CATEGORY_TINTS: Record<PlaceCategory, string> = {
	food: "bg-category-food",
	culture: "bg-category-culture",
	nature: "bg-category-nature",
	shopping: "bg-category-shopping",
	nightlife: "bg-category-nightlife",
	attraction: "bg-category-attraction",
};
