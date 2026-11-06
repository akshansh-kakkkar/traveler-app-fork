interface ProfileDetailsProps {
	name: string;
	email: string;
}

export default function ProfileDetails({ name, email }: ProfileDetailsProps) {
	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<h2 className="mb-5 font-bold text-[#12271A] text-lg">Account Details</h2>
			<div className="space-y-4">
				<div>
					<p className="text-[#6C776D] text-sm">Full Name</p>
					<p className="text-[#12271A] text-medium">{name}</p>
				</div>
				<div>
					<p className="text-[#6C776D] text-sm">Email Address</p>
					<p className="text-[#12271A] text-medium">{email}</p>
				</div>
			</div>
		</section>
	);
}
