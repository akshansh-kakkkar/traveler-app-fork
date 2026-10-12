import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  right?: ReactNode;
  onPress?: () => void;
  locked?: boolean;
  className?: string;
};

export function FieldRow({
  icon,
  label,
  value,
  right,
  onPress,
  locked,
  className,
}: Props) {
  const mutedColor = useThemeColor("muted");
  const foregroundColor = useThemeColor("foreground");

  // right slot: custom control > padlock > chevron > nothing
  const trailing =
    right ??
    (locked ? (
      <Ionicons name="lock-closed-outline" size={18} color={mutedColor} />
    ) : onPress ? (
      <Ionicons name="chevron-forward" size={18} color={mutedColor} />
    ) : null);

  return (
    <Pressable
      onPress={onPress}
      disabled={locked || !onPress}
      className={cn("flex-row items-center gap-3 px-4 py-3", className)}
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-muted/20">
        <Ionicons name={icon} size={20} color={foregroundColor} />
      </View>

      <View className="flex-1">
        <Text className="text-muted text-xs">{label}</Text>
        <Text className="font-semibold text-base text-foreground">{value}</Text>
      </View>

      {trailing}
    </Pressable>
  );
}
