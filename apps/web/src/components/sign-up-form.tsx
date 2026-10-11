import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Eye, EyeClosed, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";
import z from "zod";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });
  const [passwordEye, setpasswordEye] = useState(false);
  const [passwordEyeConfirm, setPasswordEyeConfirm] = useState(false);

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
            <div className="text-black flex flex-col text-start w-full gap-2">
              <label htmlFor="" className="font-volkhov font-bold text-sm">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border-2 outline-none focus:outline-2 placeholder:text-[#181E4B]/60  text-[#DF6951] focus:outline-offset-2 outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
                  placeholder="Akshansh Kakkar"
                />
                <User className="absolute top-2 right-2" />
              </div>
            </div>
            <div className="text-black flex flex-col text-start w-full gap-2">
              <label htmlFor="" className="font-volkhov font-bold text-sm">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full border-2 outline-none focus:outline-2 text-[#DF6951] placeholder:text-[#181E4B]/60  focus:outline-offset-2 outline-[#DF6951] focus:border-[#DF6951] py-2 text-sm rounded-sm px-3 border-[#181E4B]"
                  placeholder="akshanshkakkar@hackclub.com"
                />
                <Mail className="absolute right-2 top-2" />
              </div>
            </div>
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
                    onClick={()=> setpasswordEye((prev)=> !prev)}
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
