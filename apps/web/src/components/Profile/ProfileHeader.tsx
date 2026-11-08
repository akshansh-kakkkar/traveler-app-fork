import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface profileHeaderProps {
	name: string;
	email: string;
	image?: string | null;
}

export default function ProfileHeader({
	name,
	email,
	image,
}: profileHeaderProps) {
	const [copied, setCopied] = useState(false);
	const handleCopyProfile = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			console.error("Unable to copy profile link.");
		}
	};
	return (
		<div className="flex items-center gap-4">
			{image ? (
				<img
					src={image}
					alt={`${name}'s profile`}
					className="h-16 w-16 rounded-full object-cover"
				/>
			) : (
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#12271A] font-bold text-2xl text-white">
					{name.charAt(0).toUpperCase()}
				</div>
			)}

			<div>
				<h2 className="font-bold text-2xl text-[#12271A]">{name}</h2>
				<p className="text-[#6C776D] text-sm">{email}</p>
			</div>
			{/* <button 
			type="button"
			onClick={handleCopyProfile}
			className="flex items-center gap-2 rounded-lg border border-[#D1DCCF] px-4 py-2 text-sm font-medium text-[#12271A] transition hover:bg-[#Eaf3e9]"
			>
				{copied ? <Check size={16} /> : <Copy size={16} />}
				{copied ? "Copied!" : "Copy Profile Link"}
			</button> */}
		</div>
	);
}
