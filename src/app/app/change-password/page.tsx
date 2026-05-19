"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { changePassword, clearError } from "@/lib/slices/authSlice";
import { toast } from "sonner";
import { passwordSchema } from "@/lib/schemas/auth.schema";

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export default function AppChangePasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    dispatch(clearError());
    
    const result = await dispatch(changePassword({
      password: data.currentPassword,
      newPassword: data.newPassword
    }));

    if (changePassword.fulfilled.match(result)) {
      toast.success(result.payload.message || "Password updated successfully");
      reset(); // Clear form on success
    } else {
      toast.error(result.payload as string || "Failed to update password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] rounded-[32px] bg-[#EAFCFF] p-6">
      <div className="mx-auto w-full max-w-[760px] rounded-[24px] bg-white p-8 shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#005864]/10 text-[#005864]">
            <KeyRound size={20} />
          </span>
          <div>
            <h1 className="text-[30px] font-bold text-[#1C1C1C]">Change Password</h1>
            <p className="text-[14px] text-black/70">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Enter current password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Enter new password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-[12px] bg-[#005864] text-[15px] font-semibold text-white hover:opacity-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
