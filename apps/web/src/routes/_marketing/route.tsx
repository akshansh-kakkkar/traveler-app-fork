import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
	<div className="min-h-screen bg-white w-full">
		<Outlet />
	</div>
	)
}
