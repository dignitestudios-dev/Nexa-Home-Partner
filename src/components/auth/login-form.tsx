"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginSchema } from "@/lib/schemas/auth.schema";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: wire up real auth action/API call
    console.log("LOGIN DATA:", data);
    router.push("/app/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[388px] flex flex-col"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          Welcome back!
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          Enter your details below to login.
        </p>
      </div>

      {/* Fields */}
      <div className="mt-8">
        {/* Email */}
        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
            Email
          </label>
          <Input
            type="email"
            placeholder="mikesmith@gmail.com"
            className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
            {...register("email")}
          />
          <div className=" mt-2">
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email.message}</div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
            Password
          </label>

          <div className="relative mt-[6px]">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 pr-12 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/70"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>

          <div className="min-h-[20px] mt-2">
            {errors.password && (
              <div className="text-red-600 text-sm">{errors.password.message}</div>
            )}
          </div>
        </div>

        {/* Forgot */}
        <div className="flex justify-end mb-6">
          <Link
            href="/auth/forgot-password"
            className="text-[16px] font-[500] text-[#005864] tracking-[-0.408px]"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Continue */}
        <button
          type="submit"
          className="w-full h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99]"
        >
          Continue
        </button>

        {/* Don't have an account? Sign Up */}
        <div className="mt-5 text-center text-[16px] leading-[22px] text-black/80">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-[#005864] font-[500]">
            Sign Up
          </Link>
        </div>

        {/* OR divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">
            OR
          </div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Social buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img
              src="/asset/google.png"
              alt="Google"
              width={24}
              height={24}
              className="w-[24px] h-[24px] object-contain"
            />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img
              src="/asset/apple.png"
              alt="Apple"
              width={24}
              height={24}
              className="w-[24px] h-[24px] object-contain"
            />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </form>
  );
}

