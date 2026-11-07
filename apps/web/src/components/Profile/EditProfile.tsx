import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

interface EditProfileProps {
	name : string;
}

export default function EditProfile({ name } : EditProfileProps){
	const [newName, setNewName] = useState(name);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		const trimmedName = newName.trim();
		if(!trimmedName){
			toast.error("Name cannot be empty.");
			return;
		}
		if(trimmedName === name){
			toast.info("No changes to save.");
			return;
		}
		
		setIsSaving(true);
		try{
			const { error } = await authClient.updateUser({
				name :trimmedName
			});

			if(error){
				toast.error("Unable to update profile.");
				return;
			}
			setNewName(trimmedName)
			toast.success("Profile updated successfully.");
		}catch {
			toast.error("Something went wrong.");
		}
		finally{
			setIsSaving(false);
		}
	}

	return(
		<section className="rounded-2xl border border-[#d1dccF] bg-white p-6">
			<h2 className="mb-4 text-lg font-bold text-[#12271A]">
				Edit Profile
			</h2>
			<label className="mb-2 block text-sm text-[#6C776D]">
				Display Name
			</label>
			<input
			value={newName}
			onChange={(event)=>setNewName(event.target.value)}
			className="w-full rounded-lg border border-[#D1DCCF] px-4 py-3 outline-none focus:border-[#426449]"
			/>
			<button 
			type="button"
			onClick={handleSave}
			disabled={isSaving}
			className="mt-4 rounded-lg bg-[#17281E] px-5 py-2 font-semibold text-white disabled:opacity-50"
			>
				{isSaving ? "Saving..." : "Save Changes"}
			</button>
		</section>
	)
}