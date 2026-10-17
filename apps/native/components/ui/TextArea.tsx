import { cn, useThemeColor } from "heroui-native";
import { Text, TextInput, View } from "react-native";

type Props = {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	optional?: boolean;
	editable?: boolean;
	maxLength?: number;
	className?: string;
};

export function TextArea({
	label,
	value,
	onChangeText,
	placeholder,
	optional,
	editable = true,
	maxLength = 500,
	className,
}: Props) {
	const mutedColor = useThemeColor("muted");

	return (
		<View className={cn("gap-2", className)}>
			<View className="flex-row items-center justify-between">
				<Text className="font-semibold text-foreground text-sm">{label}</Text>
				{optional && <Text className="text-muted text-sm">Optional</Text>}
			</View>

			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={mutedColor}
				editable={editable}
				multiline
				maxLength={maxLength}
				textAlignVertical="top"
				className="min-h-28 rounded-3xl bg-surface p-4 text-base text-foreground"
			/>
		</View>
	);
}
