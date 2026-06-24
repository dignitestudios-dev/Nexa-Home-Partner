"use client";

import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { checkEmail, loginUser, setTempPassword, clearError, socialAuth } from "@/lib/slices/authSlice";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFlowData, authFlowSchema } from "@/lib/schemas/auth.schema";
import { AccountCreatedModal } from "./account-created-modal";
import { setLocalStorage } from "@/utils/localStorage";

// ✅ Schema aur type ab yahan se import ho rahi hain


export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isEmailVerified, loading, error: authError } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm<AuthFlowData>({
    resolver: zodResolver(authFlowSchema),
    mode: "onChange",
  });
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isNewUserButtonDisabled =
    emailSubmitted &&
    !userExists &&
    (
      !password?.trim() ||
      !confirmPassword?.trim() ||
      !isValid
    );
  const handleContinue = async () => {
    dispatch(clearError());

    const isEmailValid = await trigger("email");

    if (isEmailValid) {
      const email = getValues("email");

      const result = await dispatch(checkEmail(email));

      if (checkEmail.fulfilled.match(result)) {
        const existsStatus = result.payload.exists;

        console.log(existsStatus);

        // ✅ Existing user
        if (existsStatus === "yes") {
          toast.success("Welcome back!");

          setUserExists(true);
          setEmailSubmitted(true);
        }

        // ✅ New user
        else if (existsStatus === "no") {
          toast.success("Let's complete your account setup");

          setUserExists(false);
          setEmailSubmitted(true);
        }

        // ✅ Conflict user
        else if (existsStatus === "yes-conflict") {
          // toast.error("This email is already used with another login method");

          // popup open karwana ho toh state set karo
          setIsSuccessModalOpen(true);

          return;
        }
      } else {
        toast.error(
          (result.payload as string) || "Failed to check email"
        );
      }
    }
  };
  const onSubmit = async (data: AuthFlowData) => {



    if (!emailSubmitted) {
      await handleContinue();
      return;
    }
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



      if (user?.isEmailVerified) {
        if (user?.isProfileCompleted) {
          router.push("/app/dashboard");
        } else {
          dispatch(setTempPassword(data.password!));
          router.push("/auth/register");
        }
      } else {
        router.push(
          `/auth/signup-verify-otp?email=${encodeURIComponent(data.email)}`
        );
        setLocalStorage("tempEmail", data.email);
      }
    } else {
      toast.error((loginResult.payload as string) || "Authentication failed");
    }
  };
  const handleSocialLogin = async (type: "google" | "apple") => {
    try {
      const res = await dispatch(socialAuth({ type }));
      console.log(res, 'res');
      if (socialAuth.rejected.match(res)) {
        toast.error((res.error?.message as string) || "Social login failed");
        return;
      }

      // ✅ Success toast add karo
      toast.success(res?.payload?.message || "Login successful");

      const user = res?.payload?.data?.user;

      if (user?.isProfileCompleted === false) {
        router.push("/auth/register");
      } else {
        router.push("/app/dashboard");
      }
    } catch (err) {
      toast.error((err as Error)?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[388px] h-full flex flex-col items-center justify-center"
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
              type="text"
              placeholder="mikesmith@gmail.com"
              disabled={emailSubmitted && !loading}
              value={emailSubmitted ? getValues("email").trim() : undefined}  // ✅ display trim
              className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              {...register("email", {
                setValueAs: (val) => val.trim(), // ✅ submit pe bhi trim
              })}
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
          </div>
        </div>

        {/* Password & Confirm Password */}
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
          disabled={loading || isNewUserButtonDisabled}
          className="w-full h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            emailSubmitted
              ? userExists
                ? "Login"
                : "Sign Up"
              : "Continue"
          )}
        </button>

        {/* OR divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">OR</div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Social buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img src="/asset/google.png" alt="Google" width={24} height={24} className="w-[24px] h-[24px] object-contain" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("apple")}
            className="w-[188px] h-[50px]  bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img src="/asset/apple.png" alt="Apple" width={24} height={24} className="w-[24px] h-[24px] object-contain" />
            <span>Apple</span>
          </button>
        </div>

      </div>
      <AccountCreatedModal
        open={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);

        }}
      />
    </form>
  );
}