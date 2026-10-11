import type { PlaceCategory } from "@traveler-app/db";
import { cn } from "heroui-native";
import { Text, View } from "react-native";

const CATEGORY_STYLES: Record<PlaceCategory, string> = {
  food: "bg-category-food",
  culture: "bg-category-culture",
  nature: "bg-category-nature",
  shopping: "bg-category-shopping",
  nightlife: "bg-category-nightlife",
  attraction: "bg-category-attraction",
};

export default function CategoryTag({ category }: { category: PlaceCategory }) {
  return (
    <View
      className={cn(
        "self-start rounded-full px-3 py-1",
        CATEGORY_STYLES[category],
      )}
    >
      <Text className="font-medium text-foreground text-xs">{category}</Text>
    </View>
  );
}
