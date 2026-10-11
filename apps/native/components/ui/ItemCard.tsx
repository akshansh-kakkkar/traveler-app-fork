import { Ionicons } from "@expo/vector-icons";
import type { PlaceCategory } from "@traveler-app/db";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import CategoryTag from "./CategoryTag";

type Props = {
  startTime: string;
  duration: string;
  title: string;
  description: string;
  category: PlaceCategory;
  done: boolean;
  isNext?: boolean;
  onToggle: () => void; // tap the circle
  onPress?: () => void; // tap the card (open place)
  className?: string;
};

export function ItemCard({
  startTime,
  duration,
  title,
  description,
  category,
  done,
  isNext,
  onToggle,
  onPress,
  className,
}: Props) {
  const checkColor = useThemeColor("background");

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row gap-4 rounded-3xl p-4",
        isNext ? "bg-foreground" : "bg-background",
        className,
      )}
    >
      {/* time column */}
      <View className="w-16">
        <Text
          className={cn(
            "font-semibold text-sm",
            isNext ? "text-background" : "text-foreground",
          )}
        >
          {startTime}
        </Text>
        <Text
          className={cn(
            "text-xs",
            isNext ? "text-background/70" : "text-muted",
          )}
        >
          {duration}
        </Text>
      </View>

      {/* content column */}
      <View className="flex-1 gap-1">
        {isNext && <Text className="text-background/70 text-xs">Up next</Text>}
        <Text
          className={cn(
            "font-bold text-base",
            isNext ? "text-background" : "text-foreground",
            done && "text-muted line-through",
          )}
        >
          {title}
        </Text>
        <Text
          className={cn(
            "text-sm",
            isNext ? "text-background/80" : "text-muted",
          )}
        >
          {description}
        </Text>
        <CategoryTag category={category} />
      </View>

      {/* check circle */}
      <Pressable onPress={onToggle} hitSlop={8}>
        <View
          className={cn(
            "h-8 w-8 items-center justify-center rounded-full border-2",
            done
              ? "border-foreground bg-foreground"
              : isNext
                ? "border-accent"
                : "border-muted",
          )}
        >
          {done && <Ionicons name="checkmark" size={18} color={checkColor} />}
        </View>
      </Pressable>
    </Pressable>
  );
}
