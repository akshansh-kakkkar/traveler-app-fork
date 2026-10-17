import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { useRef, useState } from "react";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

const signInSchema = z
	.object({
		email: z.email("Enter a valid email address"),
		password: z.string().min(1, "Please enter your password."),
	})

const inputClass =
	"w-full rounded-sm border-2 border-[#181E4B] px-3 py-2 pr-10 text-sm text-[#DF6951] outline-none placeholder:text-[#181E4B]/50 focus:border-[#DF6951] focus:outline-2 focus:outline-offset-2 focus:outline-[#Df6951]";

function FieldError({ errors }: { errors: unknown[] }) {
	if (!errors.length) return null;
	return (
		<p className="text-red-600 text-xs" role="alert">
			{errors
				.map((error) =>
					typeof error === "string"
						? error
						: error instanceof Error
							? error.message
							: "Invalid value",
				)
				.join(", ")}
		</p>
	);
}

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const navigate = useNavigate({ from: "/" });
	const formRef = useRef<HTMLDivElement>(null);
	const [passwordEye, setpasswordEye] = useState(false);
	const { isPending } = authClient.useSession();
	const [passwordEyeConfirm, setPasswordEyeConfirm] = useState(false);
	const [isGooglePending, setIsGooglePending] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signInSchema,
		},

		onSubmit: async ({ value }) => {
			try {
				await authClient.signIn.email(
					{
						email: value.email.trim(),
						password: value.password,
					},
					{
						onSuccess: () => {
							toast.success("Signed in successfully");
							void navigate({ to: "/dashboard" });
						},
						onError: (ctx) => {
							toast.error(
								ctx.error.message || "Unable to create your account.",
							);
						},
					},
				);
			} catch {
				toast.error("Something went wrong. Please try again");
			}
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100 text-center">
			<div className="mx-64 flex w-full rounded-lg bg-white shadow-md">
				<div className="relative inset-0 inset-0 h-[650px] w-1/2 rounded-l-lg bg-[url('/about-hero.jpg')] bg-center bg-cover">
					<div className="absolute inset-0 rounded-l-lg bg-black/40" />
					<div className="z-500 absolute m-12">
						<img src="/navbar-logo.png" alt="logo" />
					</div>
				</div>
								<div className="mx-4 my-4 flex w-1/2 flex-col items-start justify-start">
									<div className="mt-6 flex w-full justify-center">
										<img src="/footer-logo.png" alt="logo" />
									</div>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											e.stopPropagation();
											void form.handleSubmit();
										}}
										className="flex w-full flex-col items-center justify-start gap-4"
									>

										<form.Field name="email">
											{(field) => (
												<div className="flex w-full flex-col gap-2 text-start text-black">
													<label
														htmlFor={field.name}
														className="font-bold font-volkhov text-sm"
													>
														Email
													</label>
													<div className="relative">
														<input
															id={field.name}
															value={field.state.value}
															name={field.name}
															onBlur={field.handleBlur}
															autoComplete="email"
															onChange={(e) => field.handleChange(e.target.value)}
															type="email"
															className="w-full rounded-sm border-2 border-[#181E4B] px-3 py-2 text-[#DF6951] text-sm outline-none outline-[#DF6951] placeholder:text-[#181E4B]/60 focus:border-[#DF6951] focus:outline-2 focus:outline-offset-2"
															placeholder="akshanshkakkar@hackclub.com"
														/>
														<Mail className="absolute top-2 right-2" />
													</div>
													<FieldError errors={field.state.meta.errors} />
												</div>
											)}
										</form.Field>
				
										<div className="flex w-full gap-4">
											<form.Field name="password">
												{(field) => (
													<div className="flex w-full flex-col gap-2 text-start text-black">
														<label
															htmlFor=""
															className="font-bold font-volkhov text-sm"
														>
															Password
														</label>
														<div className="relative">
															<input
																type={passwordEye ? "text" : "password"}
																id={field.name}
																name={field.name}
																value={field.state.value}
																onBlur={field.handleBlur}
																onChange={(e) => field.handleChange(e.target.value)}
																autoComplete="current-password"
																className={inputClass}
																placeholder="● ● ● ● ● ● ● ● ● ● ● ●"
															/>
															<button
																className="absolute top-3 right-2"
																type="button"
																onClick={() => setpasswordEye((prev) => !prev)}
															>
																{passwordEye ? <Eye size={18} /> : <EyeOff size={18} />}
															</button>
														</div>
														<FieldError errors={field.state.meta.errors} />
													</div>
												)}
											</form.Field>

										</div>
										<button
											type="submit"
											className="w-full cursor-pointer rounded-lg bg-[#DF6951] py-1 font-medium font-poppins text-2xl transition-all duration-300 hover:scale-98"
										>
											Submit
										</button>
									</form>
									<div className="my-6 flex w-full items-center justify-center gap-2 text-center text-black">
										<div className="h-[1px] w-full bg-black" />
										<div className="font-light">or</div>
										<div className="h-[1px] w-full bg-black" />
									</div>
									<button
										type="button"
										disabled={isGooglePending}
										onClick={async () => {
											setIsGooglePending(true);
											try {
												await authClient.signIn.social({
													provider: "google",
													callbackURL: "/dashboard",
												});
											} catch {
												toast.error("Google sign-in failled. Please try again.");
												setIsGooglePending(false);
											}
										}}
										className="flex w-full cursor-pointer items-center justify-center gap-4 rounded-md border-1 border-black py-2 font-medium font-poppins font-volkhov text-2xl text-black transition-all duration-300 hover:scale-98"
									>
										{isGooglePending ? (
											<Loader2 className="animate-spin text-[#DF6951]" />
										) : (
											<>
												<span>
													<img src="/google.png" />
												</span>
												<span>Continue with Google</span>
											</>
										)}
									</button>
									<div className="text-black text-sm flex w-full h-2 gap-1 items-center justify-center py-4 font-light">Don't have an account?
									<button
									type="button"
									onClick={onSwitchToSignUp}
									className="underline underline-offset-2">Sign up</button>
									</div>
								</div>
			</div>
		</div>
	);
}
