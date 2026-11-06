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
		</div>
	);
}
