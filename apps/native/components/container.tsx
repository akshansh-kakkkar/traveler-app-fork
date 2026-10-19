import { cn } from "heroui-native";
import type { PropsWithChildren } from "react";
import {
	ScrollView,
	type ScrollViewProps,
	View,
	type ViewProps,
} from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabBarSpace } from "@/lib/tab-bar";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
	className?: string;
	isScrollable?: boolean;
	hasTabBar?: boolean;
	contentClassName?: string;
	scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
};

export function Container({
	children,
	className,
	isScrollable = true,
	hasTabBar = true,
	scrollViewProps,
	contentClassName,
	...props
}: PropsWithChildren<Props>) {
	const insets = useSafeAreaInsets();
	const tabBarSpace = useTabBarSpace();
	const bottomSpace = hasTabBar ? tabBarSpace : insets.bottom + 16;

	return (
		<AnimatedView
			className={cn("flex-1 bg-background", className)}
			style={{
				paddingBottom: insets.bottom,
			}}
			{...props}
		>
			{isScrollable ? (
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingBottom: bottomSpace,
						paddingTop: insets.top,
					}}
					keyboardShouldPersistTaps="handled"
					contentInsetAdjustmentBehavior="automatic"
					contentContainerClassName={contentClassName}
					{...scrollViewProps}
				>
					{children}
				</ScrollView>
			) : (
				<View className="flex-1">{children}</View>
			)}
		</AnimatedView>
	);
}
