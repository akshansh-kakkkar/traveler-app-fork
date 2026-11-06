interface ProfileDetailsProps {
	name : string;
	email : string;
}

export default function ProfileDetails({
	name,
	email
} : ProfileDetailsProps){
	return(
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<h2 className="mb-5 font-bold text-lg text-[#12271A]">
				Account Details
			</h2>
			<div className="space-y-4">
				<div>
					<p className="text-sm text-[#6C776D]">Full Name</p>
					<p className="text-medium text-[#12271A]">{name}</p>
				</div>
				<div>
					<p className="text-sm text-[#6C776D]">Email Address</p>
					<p className="text-medium text-[#12271A]">{email}</p>
				</div>
			</div>
		</section>
	)
}