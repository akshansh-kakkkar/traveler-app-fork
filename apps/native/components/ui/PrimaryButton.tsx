import { cn } from "heroui-native";
import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  className,
}: Props) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      className={cn(
        "h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-accent active:opacity-80",
        disabled && !loading && "opacity-40",
        className,
      )}
    >
      {loading && <ActivityIndicator color="#111" />}
      <Text className="font-bold text-base text-foreground">
        {loading ? "Building..." : label}
      </Text>
    </Pressable>
  );
}
