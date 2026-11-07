import { Check } from "lucide-react";

interface ProfileCompletionProps {
	name: string;
	email: string;
	image?: string | null;
}

export default function ProfileCompletion({
	name,
	email,
	image,
}: ProfileCompletionProps) {
	const fields = [
		{
			label: "Display name",
			completed: !!name.trim(),
		},
		{
			label: "Email address",
			completed: !!name.trim(),
		},
		{
			label: "Profile picture",
			completed: !!image,
		},
	];

	const completedCount = fields.filter((field) => field.completed).length;
	const percentage = Math.round((completedCount / fields.length) * 100);

	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<div className="mb-4 flex items-center justify-center">
				<div>
					<h2 className="flex text-[#12271] text-lg">Profile Completion</h2>
					<p className="mt-1 text-[#6C776D] text-sm">
						Complete your profile to personalize your experience
					</p>
				</div>
				<span className="font-bold text-[#426449]">{percentage}%</span>
			</div>
			<div className="mb-5 h-2 overflow-hidden rounded-full bg-[#E8EEE6]">
				<div
					className="h-full rounded-full bg-[#426449] transition-all duration-500"
					style={{ width: `${percentage}%` }}
				/>
				<div className="space-y-3">
					{fields.map((field) => (
						<div key={field.label} className="flex items-center gap-3 text-sm">
							<span
								className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${field.completed ? "bg-[#426449] text-white" : "border border-[#D1DCCF] text-transparent"}`}
							>
								<Check />
							</span>
							<span className="text-[#12271A]">{field.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
