import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  className?: string;
};

export default function MetaPill({ icon, label, className }: Props) {
  const foregroundColor = useThemeColor("foreground");

  return (
    <View
      className={cn(
        "flex-row items-center gap-1.5 self-start rounded-full bg-surface px-3 py-1.5",
        className,
      )}
    >
      {icon && <Ionicons name={icon} size={14} color={foregroundColor} />}
      <Text className="font-medium text-foreground text-xs">{label}</Text>
    </View>
  );
}
