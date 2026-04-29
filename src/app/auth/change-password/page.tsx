"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";
import { PasswordUpdatedModal } from "@/components/auth/passwordupdatemodal";

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ChangePasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    console.log("PASSWORD DATA:", data);
    setPasswordUpdated(true);
  };

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href="/auth/verify-otp"
        className="absolute left-0 top-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="flex-1 bg-white flex items-start justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[496px] min-h-[560px] mx-auto"
        >
          {/* Heading */}
          <div className="text-center mt-[122px]">
            <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
              Create New Password
            </h1>
            <p className="mt-2 text-[16px] leading-[22px] text-black/80 max-w-[496px] mx-auto">
            Enter your new password to reset
            </p>
          </div>

          {/* New Password */}
          <div className="mt-[52px] w-[388px] mx-auto">
            <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
                Password
            </label>

            <div className="relative mt-[6px]">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password")}
                className="w-full h-[48px] bg-[#F8F8F8] rounded-[12px] border-0 px-4 pr-10 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="mt-2">
              {errors.password && (
                <div className="text-red-600 text-sm">{errors.password.message}</div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mt-4 w-[388px] mx-auto">
            <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
              Confirm Password
            </label>

            <div className="relative mt-[6px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className="w-full h-[48px] bg-[#F8F8F8] rounded-[12px] border-0 px-4 pr-10 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="min-h-[20px] mt-2">
              {errors.confirmPassword && (
                <div className="text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-[388px] mx-auto block h-[48px] mt-3 bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99]"
          >
            Update Password
          </button>
        </form>
      </div>
      <PasswordUpdatedModal
        open={passwordUpdated}
        onClose={() => setPasswordUpdated(false)}
      />
    </div>
  );
}