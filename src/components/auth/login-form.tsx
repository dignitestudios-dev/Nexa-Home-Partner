"use client";

import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { checkEmail, loginUser, setTempPassword, clearError } from "@/lib/slices/authSlice";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const authFlowSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword && data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AuthFlowData = z.infer<typeof authFlowSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isEmailVerified, loading, error: authError } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AuthFlowData>({
    resolver: zodResolver(authFlowSchema),
    mode: "onBlur",
  });

  const handleContinue = async () => {
    dispatch(clearError());
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      const email = getValues("email");
      const result = await dispatch(checkEmail(email));

      if (checkEmail.fulfilled.match(result)) {
        toast.success(result.payload.exists ? "Welcome back!" : "Create your account");
        console.log(result.payload);
        setUserExists(result.payload.exists); // true = login, false = signup
        setEmailSubmitted(true);
      } else {
        toast.error(result.payload as string || "Failed to check email");
      }
    }
  };

const onSubmit = async (data: AuthFlowData) => {
  dispatch(clearError());

  const loginResult = await dispatch(
    loginUser({
      email: data.email,
      password: data.password!,
    })
  );

  if (loginUser.fulfilled.match(loginResult)) {
    const user = loginResult.payload?.data?.user;
    console.log(user);

    toast.success(loginResult.payload?.message || "Login successful");

    // save email
    localStorage.setItem("tempEmail", data.email);

    // ✅ CHECK isVerified
    if (user?.isEmailVerified) {
      // profile complete check
      if (user?.isProfileCompleted) {
        router.push("/app/dashboard");
      } else {
        dispatch(setTempPassword(data.password!));
        router.push("/auth/register");
      }
    } else {
      // email not verified
      router.push(
        `/auth/signup-verify-otp?email=${encodeURIComponent(data.email)}`
      );
    }
  } else {
    toast.error((loginResult.payload as string) || "Authentication failed");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[388px] flex flex-col"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          {emailSubmitted
            ? (userExists ? "Welcome back!" : "Create Account")
            : "Welcome back!"}
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          {emailSubmitted
            ? (userExists ? "Enter your password to login." : "Enter details to create your account.")
            : "Enter your email to continue."}
        </p>
      </div>

      {/* Fields */}
      <div className="mt-8">

        {/* Email */}
        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
            Email
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="mikesmith@gmail.com"
              disabled={emailSubmitted && !loading}
              className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              {...register("email")}
            />
            {emailSubmitted && !loading && (
              <button
                type="button"
                onClick={() => {
                  setEmailSubmitted(false);
                  setUserExists(false);
                }}
                className="absolute right-3 top-[18px] text-[12px] text-[#005864] font-semibold"
              >
                Change
              </button>
            )}
          </div>
          <div className="mt-2">
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email.message}</div>
            )}
            {authError && (
              <div className="text-red-600 text-sm">{authError}</div>
            )}
          </div>
        </div>

        {/* Password & Confirm Password — only shown after email is submitted */}
        {emailSubmitted && (
          <>
            {/* Password */}
            <div className="">
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

            {/* Confirm Password — only for NEW users */}
            {!userExists && (
              <div className="mb-4">
                <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
                  Confirm Password
                </label>
                <div className="relative mt-[6px]">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 pr-12 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/70"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </div>
                <div className="min-h-[20px] mt-2">
                  {errors.confirmPassword && (
                    <div className="text-red-600 text-sm">{errors.confirmPassword.message}</div>
                  )}
                </div>
              </div>
            )}

            {/* Forgot Password — only for existing users */}
            {userExists && (
              <div className="flex justify-end mb-6">
                <Link
                  href="/auth/forgot-password"
                  className="text-[16px] font-[500] text-[#005864] tracking-[-0.408px]"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </>
        )}

       {/* Action Button */}
<button
  type={emailSubmitted ? "submit" : "button"}
  onClick={!emailSubmitted ? handleContinue : undefined}
  disabled={loading}
  className="w-full h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center"
>
  {loading ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    emailSubmitted ? (userExists ? "Login" : "Sign Up") : "Continue"
  )}
</button>

        {/* OR divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">OR</div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Social buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img src="/asset/google.png" alt="Google" width={24} height={24} className="w-[24px] h-[24px] object-contain" />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img src="/asset/apple.png" alt="Apple" width={24} height={24} className="w-[24px] h-[24px] object-contain" />
            <span>Apple</span>
          </button>
        </div>

      </div>
    </form>
  );
}