import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function ScreenHeader({ title, eyebrow, onBack, right }: Props) {
  const foregroundColor = useThemeColor("foreground");

  return (
    <View className="gap-4">
      {(onBack || right) && (
        <View className="flex-row items-center justify-between">
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-12 w-12 items-center justify-center rounded-full bg-background"
            >
              <Ionicons name="chevron-back" size={22} color={foregroundColor} />
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}

      <View className="gap-1">
        {eyebrow && <Text className="text-muted text-sm">{eyebrow}</Text>}
        <Text className="font-bold text-4xl text-foreground">{title}</Text>
      </View>
    </View>
  );
}
