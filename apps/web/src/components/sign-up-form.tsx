import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Eye, EyeClosed, EyeOff, Mail, User } from "lucide-react";
import { useRef, useState } from "react";
import z from "zod";
import { error } from 'node:console';

const signupSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters."),
	confirmPassowrd: z.string().min(1, "Please confirm your password"),
}).refine((values) => values.confirmPassowrd === values.confirmPassowrd, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

const inputClass = "w-full rounded-sm border-2 border-[#181E4B] px-3 py-2 pr-10 text-sm text-[#DF6951] outline-none placeholder:text-[#181E4B]/50 focus:border-[#DF6951] focus:outline-2 focus:outline-offset-2 focus:outline-[#Df6951]"

function FieldError({ errors }: { errors: unknown[] }) {
	if (!errors.length) return null;
	return (
		<p className="text-xs text-red-600" role="alert">
			{errors
				.map((error) =>
					typeof error === "string"
						? error
						: error instanceof Error
							? error.message
							: "Invalid value"
				).join(", ")}
		</p>
	)
}

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const navigate = useNavigate({ from: "/" });
	const formRef = useRef<HTMLDivElement>(null);
	const [passwordEye, setpasswordEye] = useState(false);
	const { isPending } = authClient.useSession();
	const [passwordEyeConfirm, setPasswordEyeConfirm] = useState(false);
	const [isGooglePending, setIsGooglePending] = useState(false);
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: signupSchema,
		},

		onSubmit: async ({ value }) => {
			try {
				await authClient.signUp.email(
					{
						name: value.name.trim(),
						email: value.email.trim(),
						password: value.password,
					},
					{
						onSuccess: () => {
							toast.success("Account creeated successfully!");
							void navigate({ to: "/dashboard" });
						},
						onError: (error) => {
							toast.error(error.error.message || "Unable to create your account.")
						}
					}
				)
			}
			catch {
				toast.error("Something went wrong. Please try again")
			}
		}
	})

	if (isPending) {
		return <Loader />;
	}
	return (
		<div className="h-screen flex bg-gray-100 justify-center items-center text-center">
			<div className="bg-whit w-full mx-64 shadow-md rounded-lg flex">
				<div className="w-1/2 relative inset-0 rounded-l-lg inset-0 h-[600px] bg-[url('/about-hero.jpg')] bg-cover bg-center">
					<div className="bg-black/20 absolute inset-0 rounded-l-lg" />
				</div>
				<div className="w-1/2  my-4 mx-4 flex flex-col justify-start items-start">
					<div className="flex justify-center w-full mt-6">
						<img src="/footer-logo.png" alt="logo" />
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
						}}
						className="flex flex-col gap-4 justify-start w-full items-center "
					>        
					<form.Field name="name">
							{(field) => (
								<div className="text-black flex flex-col text-start w-full gap-2">
									<label htmlFor={field.name} className="font-volkhov font-bold text-sm">
										Name
									</label>
									<div className="relative">
										<input
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											autoComplete="name"
											onChange={(e) => field.handleChange(e.target.value)}
											type="namee"
											className="w-full border-2 outline-none focus:outline-2 text-[#DF6951] placeholder:text-[#181E4B]/60  focus:outline-offset-2 outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
											placeholder="Akshansh Kakkar"
										/>
										<Mail className="absolute right-2 top-2" />
									</div>
									<FieldError errors={field.state.meta.errors} />
								</div>
							)}
						</form.Field>

						<form.Field name="email">
							{(field) => (
								<div className="text-black flex flex-col text-start w-full gap-2">

									<label htmlFor={field.name} className="font-volkhov font-bold text-sm">
										Email
									</label>
									<div className="relative">
										<input
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											autoComplete="email"
											onChange={(e) => field.handleChange(e.target.value)}
											type="email"
											className="w-full border-2 outline-none focus:outline-2 text-[#DF6951] placeholder:text-[#181E4B]/60  focus:outline-offset-2 outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
											placeholder="akshanshkakkar@hackclub.com"
										/>
										<Mail className="absolute right-2 top-2" />
									</div>
									<FieldError errors={field.state.meta.errors} />
								</div>
							)}
						</form.Field>

						<div className="flex w-full gap-4">
							<div className="text-black flex flex-col text-start w-full gap-2">
								<label htmlFor="" className="font-volkhov font-bold text-sm">
									Password
								</label>
								<div className="relative">
									<input
										type={passwordEye ? "text" : "password"}
										className="w-full border-2 outline-none pr-8 focus:outline-2 text-[#DF6951] focus:outline-offset-2 placeholder:text-[#181E4B]/60  outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
										placeholder="● ● ● ● ● ● ● ● ● ● ● ●"
									/>
									<button
										className="absolute top-3 right-2"
										type="button"
										onClick={() => setpasswordEye((prev) => !prev)}
									>
										{passwordEye ? (
											<Eye size={18} />
										) : (
											<EyeOff size={18} />
										)}
									</button>
								</div>
							</div>
							<div className="text-black flex flex-col text-start w-full gap-2">
								<label htmlFor="" className="font-volkhov font-bold text-sm">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={passwordEyeConfirm ? "text" : "password"}
										className="w-full border-2 outline-none pr-8 focus:outline-2 text-[#DF6951] placeholder:text-[#181E4B]/60 focus:outline-offset-2 outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
										placeholder="● ● ● ● ● ● ● ● ● ● ● ●"
									/>
									<button
										type="button"
										onClick={() => setPasswordEyeConfirm((prev) => !prev)}
										className="absolute top-3 right-2"
									>
										{passwordEyeConfirm ? (
											<Eye size={18} />
										) : (
											<EyeOff size={18} />
										)}
									</button>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="bg-[#DF6951] hover:scale-98 transition-all duration-300 font-poppins font-medium w-full py-1 cursor-pointer rounded-lg  text-2xl"
						>
							Submit
						</button>
					</form>
					<div className="w-full text-black my-6 flex items-center gap-2 text-center justify-center">
						<div className="w-full bg-black h-[1px]" />
						<div className="font-light">or</div>
						<div className=" w-full bg-black h-[1px]" />
					</div>
					<button className="w-full cursor-pointer hover:scale-98 transition-all duration-300 text-black border-1 font-poppins font-medium border-black flex justify-center items-center gap-4 py-2 rounded-md font-volkhov text-2xl">
						<span>
							<img src="google.png" />
						</span>
						<span>Continue with Google</span>
					</button>
				</div>
			</div>
		</div>
	);
}
