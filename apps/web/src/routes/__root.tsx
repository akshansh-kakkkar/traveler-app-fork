import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "@traveler-app/ui/components/sonner";

import { ThemeProvider } from "@/components/theme-provider";
import type { trpc } from "@/utils/trpc";

import "../index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import TravelLoader from "@/components/TravelLoader";
import { useSyncConflicts } from "@/lib/use-sync-conflicts";

export interface RouterAppContext {
	trpc: typeof trpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "traveler-app",
			},
			{
				name: "description",
				content: "traveler-app is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const { conflicts } = useSyncConflicts();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [showLoader, setShowLoader] = useState(true);
	const previousPath = useRef(pathname);
	useEffect(() => {
		if (previousPath.current !== pathname) {
			previousPath.current = pathname;
			setShowLoader(true);
		}
	}, [pathname]);

	const handleLoaderComplete = useCallback(() => {
		setShowLoader(false);
	}, []);
	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<div className="grid h-svh grid-rows-[auto_1fr]">
					<Outlet />
				</div>
				{conflicts.length > 0 && (
					<div>
						{conflicts.length} offline change
						{conflicts.length !== 1 ? "s" : ""} couldn't be synced
					</div>
				)}
				{showLoader && <TravelLoader onComplete={handleLoaderComplete} />}
				<Toaster richColors />
			</ThemeProvider>
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</>
	);
}
