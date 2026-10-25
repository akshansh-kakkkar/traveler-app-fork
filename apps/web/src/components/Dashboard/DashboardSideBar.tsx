import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
	Compass,
	HomeIcon,
	List,
	LogOut,
	Pin,
	Plus,
	Route,
	UserShield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SidebarOptions = [
	{
		id: 1,
		name: "Home",
		icon: <HomeIcon />,
		route: "/dashboard",
	},
	{
		id: 2,
		name: "Explore",
		icon: <Compass />,
		route: "/explore",
	},
	{
		id: 3,
		name: "Trips",
		icon: <List />,
		route: "/trips",
	},
	{
		id: 4,
		name: "Profile",
		icon: <UserShield />,
		route: "/profile",
	},
	{
		id: 5,
		name: "Create Trip",
		icon: <Plus />,
		route: "/create-trip",
	},
];
type DashboardSideBarProps = {
	onExpandedChange: (expanded: boolean) => void;
};

export default function DashboardSideBar({
	onExpandedChange,
}: DashboardSideBarProps) {
	const pathname = useLocation();

	const router = useRouter();

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			toast.success("Signed out successfully");
			await router.navigate({ to: "/" });
		} catch {
			toast.error("Failed to sign out. Please try again.");
		}
	};

	const [sideBarSize, setSizeBarSize] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const isExpanded = sideBarSize || isHovered;

	const sideBarSizeToggle = () => {
		setSizeBarSize((prev) => {
			const next = !prev;
			onExpandedChange(next);
			return next;
		});
	};
	return (
		<div
			onMouseEnter={() => {
				setIsHovered(true);
			}}
			onMouseLeave={() => {
				setIsHovered(false);
			}}
			className={`bg-[#12271A] ${sideBarSize ? "hover:w-70" : ""} fixed flex h-screen flex-col justify-between py-4 ${isExpanded ? "w-70" : "w-20"} transition-[width] duration-300 ease-in-out`}
		>
			<div className="mx-2 mt-4 flex items-center justify-between">
				<div className="flex items-center gap-2 text-center">
					<div className="rounded-xl bg-[#CFE84A] p-2 text-[#12271A]">
						<Route />
					</div>
					<div
						className={`font-bold text-[#CFE84A] text-xl transition-all duration-900 ${isExpanded ? "block" : "hidden"}`}
					>
						TourNet
					</div>
				</div>
				<button
					type="button"
					onClick={sideBarSizeToggle}
					className={`${isExpanded ? "block" : "hidden"} cursor-pointer rounded-xl border-2 border-dashed p-2 text-[#CFE84A]`}
				>
					<Pin
						size={18}
						className={`transition-all duration-300 ${sideBarSize ? "rotate-45" : ""}`}
					/>
				</button>
			</div>

			<div className="ml-4 flex flex-col gap-6 duration-300">
				{SidebarOptions.map((item, index) => (
					<Link
						to={item.route}
						key={item.id}
						style={{
							transitionDelay: isExpanded ? `${index * 35}ms` : "0ms",
						}}
						className={`flex ${isExpanded ? "w-60" : "w-14"} h-12 items-center gap-4 rounded-xl px-4 text-center font-bold text-xl transition-[width,background-color,color] duration-300 ${location.pathname === `${item.route}` ? "bg-[#CFE84A] text-[#12271A]" : "hover:bg-[#CFE84A]/10"}`}
					>
						<span className="shrink-0">{item.icon}</span>
						<span
							className={`whitespace-nowrap duration-900 ${isExpanded ? "block" : "hidden"}`}
						>
							{item.name}
						</span>
					</Link>
				))}
			</div>
			<button
				type="button"
				onClick={handleLogout}
				className="ml-4 flex h-12 w-60 cursor-pointer items-center gap-2 rounded-xl px-4 text-center font-bold text-[#CFE84A] text-sm hover:bg-[#CFE84A]/10"
			>
				<span>
					<LogOut size={24} />
				</span>
				<span
					className={`transition-all duration-300 ${isExpanded ? "block" : "hidden"}`}
				>
					LogOut
				</span>
			</button>
		</div>
	);
}
