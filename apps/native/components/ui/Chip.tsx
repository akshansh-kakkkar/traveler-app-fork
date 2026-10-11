import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text } from "react-native";

type Prop = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Chip({
  label,
  icon,
  selected,
  onPress,
  disabled,
  className,
}: Prop) {
  const foregroundColor = useThemeColor("foreground");
  const backgroundColor = useThemeColor("background");
  const iconColor = selected ? backgroundColor : foregroundColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "flex-row items-center gap-1.5 self-start rounded-full border px-3 py-1.5 active:opacity-70",
        selected
          ? "border-foreground bg-foreground"
          : "border-border bg-surface",
        disabled && "opacity-40",
        className,
      )}
    >
      {icon && <Ionicons name={icon} size={14} color={iconColor} />}
      <Text
        className={cn(
          "font-medium text-sm",
          selected ? "text-background" : "text-foreground",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
