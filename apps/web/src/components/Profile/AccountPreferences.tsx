import { useState } from "react";

export default function AccountPreferences() {
	const [emailNotificatons, setEmailNotifications] = useState(true);
	const [tripUpdates, setTripUpdates] = useState(true);
	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<div className="mb-6">
				<h2 className="font-bold text-[#12271A] text-lg">
					Account Preferences
				</h2>
				<p className="mt-1 text-[#6C776D] text-sm">
					Manage how to receive updates from TourNet
				</p>
			</div>

			<div className="space-y-5">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="font-medium text-[#12271A]">Email Notifications</p>
						<p className="text-[#6C776D] text-sm">
							Recieve important updates through email.
						</p>
					</div>
					<input
						type="checkbox"
						checked={emailNotificatons}
						onChange={(event) => setEmailNotifications(event.target.checked)}
						className="h-5 w-5 accent-[#426449]"
					/>
				</div>
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="font-medium text-[#12271A]">Trip Updates</p>
						<p className="text-[#6C776D] text-sm">
							Receive updates about your tirps
						</p>
					</div>
					<input
						type="checkbox"
						checked={tripUpdates}
						onChange={(event) => setTripUpdates(event.target.checked)}
					/>
				</div>
			</div>
		</section>
	);
}
