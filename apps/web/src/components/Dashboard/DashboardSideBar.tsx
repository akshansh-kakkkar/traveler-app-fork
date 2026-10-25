import { Compass, HomeIcon, List, LogOut, Pin, Plus, Route, UserShield } from "lucide-react"
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const SidebarOptions = [
	{
		id: 1,
		name: "Home",
		icon: <HomeIcon />,
		route : "/dashboard",
	},
	{
		id: 2,
		name: "Explore",
		icon: <Compass />,
		route : "/explore",
	},
	{
		id: 3,
		name: "Trips",
		icon: <List />,
		route : "/trips",
	},
	{
		id: 4,
		name: "Profile",
		icon: <UserShield />,
		route : "/profile"
	},
	{
		id: 5,
		name: "Create Trip",
		icon: <Plus />,
		route : "/create-trip"
	}
]
type DashboardSideBarProps = {
	onExpandedChange : (expanded : boolean) => void;
}

export default function DashboardSideBar({onExpandedChange} : DashboardSideBarProps) {
	const pathname = useLocation();

	const router = useRouter();

	const handleLogout = async ()=>{
		try{
			await authClient.signOut();
			toast.success("Signed out successfully")
			await router.navigate({ to : "/"});
		}catch {
			toast.error("Failed to sign out. Please try again.")
		}
	}
	
	const [sideBarSize, setSizeBarSize] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const isExpanded = sideBarSize || isHovered;

	const sideBarSizeToggle = () => {
		setSizeBarSize((prev)=>{
			const next = !prev;
			onExpandedChange(next);
			return next;
		})
	}
	return (
		<div 
		 onMouseEnter={()=> {
			setIsHovered(true)
		}}
		 onMouseLeave={()=> {
			setIsHovered(false)
		 }}

		 className={`bg-[#12271A] ${sideBarSize ? "hover:w-70" : ""} h-screen py-4 fixed flex justify-between flex-col ${isExpanded ? "w-70" : "w-20"} transition-[width] ease-in-out duration-300`}>

			<div className="flex items-center mt-4 justify-between mx-2">
				<div className="flex gap-2 items-center text-center">
					<div className="bg-[#CFE84A] text-[#12271A] p-2 rounded-xl">
						<Route />
					</div>
					<div className={`font-bold text-xl text-[#CFE84A] transition-all duration-900 ${isExpanded ? "block" : "hidden"}`}>TourNet</div>
				</div>
				<button
				type="button"
				onClick={sideBarSizeToggle}
				className={`${isExpanded ? "block" : "hidden"} border-dashed border-2 text-[#CFE84A] p-2 rounded-xl cursor-pointer`}>
					<Pin size={18}  className={`transition-all duration-300  ${sideBarSize ? "rotate-45" : ""}`} />
				</button>
			</div>

			<div className="ml-4 duration-300 flex flex-col gap-6">
				{SidebarOptions.map((item, index) => (
					<Link to={item.route} key={item.id} 
					style={{
						transitionDelay : isExpanded ? `${index * 35}ms` : "0ms"
					}}
					className={`flex ${isExpanded ? "w-60" : "w-14"} h-12 rounded-xl items-center text-center px-4 gap-4 font-bold text-xl transition-[width,background-color,color] duration-300 ${location.pathname === `${item.route}` ? "bg-[#CFE84A] text-[#12271A]" : "hover:bg-[#CFE84A]/10"}`}>
						<span className="shrink-0">{item.icon}</span>
						<span className={`whitespace-nowrap duration-900 ${isExpanded ? "block" : "hidden"}`}>{item.name}</span>
					</Link>
				))}
			</div>
			<button 
			type='button'
			onClick={handleLogout}
			className="flex hover:bg-[#CFE84A]/10 cursor-pointer ml-4 text-sm w-60 h-12 rounded-xl items-center text-center px-4 gap-2 font-bold text-[#CFE84A]">
					<span>
						<LogOut size={24} />
					</span>
					<span className={`transition-all duration-300 ${isExpanded ? "block" : "hidden"}`}>LogOut</span>
			</button>
		</div>
	)
}
