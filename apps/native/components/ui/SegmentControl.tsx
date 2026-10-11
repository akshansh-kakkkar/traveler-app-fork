import { cn } from "heroui-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

export default function SegmentControl({
  options,
  value,
  onChange,
  className,
}: Props) {
  return (
    <View className={cn("flex-row rounded-full bg-muted/20 p-1", className)}>
      {options.map((item) => {
        const selected = item === value;

        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            className={cn(
              "flex-1 items-center rounded-full py-3",
              selected && "bg-foreground",
            )}
          >
            <Text
              className={cn(
                "text-sm",
                selected ? "font-bold text-background" : "text-foreground",
              )}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
