"use client";

import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotFormData) => {
    console.log("FORGOT PASSWORD:", data);
    router.push("/auth/verify-otp");
  };

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      {/* Back Button */}
      <Link
        href="/auth/login"
        className="absolute left-0 top-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[496px] min-h-[560px] mx-auto"
      >

      {/* Heading */}
      <div className="text-center mt-[122px]">
        <h1 className="text-[36px] leading-[60px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          Forgot Password?
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80 max-w-[496px] mx-auto">
          Lost your password? No worries. Enter your email below, and we&apos;ll
          send you a verification code to reset your password securely.
        </p>
      </div>

      {/* Email */}
      <div className="mt-[68px] w-[388px] mx-auto">
        <Input
          type="email"
          placeholder="lucasbenjamin@gmail.com"
          className="h-[48px] bg-[#F8F8F8] rounded-[12px] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
          {...register("email")}
        />

        <div className="min-h-[20px] mt-2">
          {errors.email && (
            <div className="text-red-600 text-sm">{errors.email.message}</div>
          )}
        </div>
      </div>

        {/* Button */}
        <button
          type="submit"
          className="w-[388px] mx-auto block h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99]"
        >
          Send OTP Code
        </button>
      </form>
    </div>
  );
}