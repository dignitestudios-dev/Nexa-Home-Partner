"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schemas/auth.schema";

type SignupFormData = z.infer<typeof signupSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("SIGNUP DATA:", data);
    const encodedEmail = encodeURIComponent(data.email);
    router.push(`/auth/signup-verify-otp?email=${encodedEmail}`);
  };

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[388px] py-6">
      <div className="text-center">
        <h1 className="text-[32px] leading-[40px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          Sign Up
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          Enter your details below to Signup.
        </p>
      </div>

      <div className="mt-4">
        <div className="flex flex-col items-center">
          <label
            htmlFor="companyLogo"
            className="w-[100px] h-[100px] rounded-full border border-dashed border-[#005864] bg-[#005864]/6 flex items-center justify-center cursor-pointer"
          >
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt="Uploaded logo preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[44px] mt-[-0.4em] leading-none text-[#005864]">+</span>
            )}
          </label>
          <input
            id="companyLogo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (logoPreviewUrl) {
                URL.revokeObjectURL(logoPreviewUrl);
              }
              if (!file) {
                setLogoFileName("");
                setLogoPreviewUrl("");
                return;
              }
              setLogoFileName(file.name);
              setLogoPreviewUrl(URL.createObjectURL(file));
            }}
          />
          <label
            htmlFor="companyLogo"
            className="mt-2 text-[16px] font-[500] text-[#005864] underline underline-offset-2 cursor-pointer"
          >
            Upload Profile Image
          </label>
         
        </div>

        <div className="mt-3">
        <div className="mb-4">
          <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Ryan Cooper"
            className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
            {...register("fullName")}
          />
          <div className="mt-1.5">
            {errors.fullName && (
              <div className="text-red-600 text-sm">{errors.fullName.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
            Email
          </label>
          <Input
            type="email"
            placeholder="mikesmith@gmail.com"
            className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[14px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
            {...register("email")}
          />
          <div className="mt-1.5">
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
            Phone Number
          </label>
          <div className="mt-[6px] flex gap-2">
            <div className="h-[48px] w-[91px] rounded-[12px] bg-[#F8F8F8] flex items-center justify-center gap-1.5 text-[16px] font-[500] text-[#1C1C1C]">
              <img
                src="/asset/usa.png"
                alt="USA flag"
                width={20}
                height={14}
                className="w-[20px] h-[14px] rounded-[2px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/asset/usa.png";
                }}
              />
              <span>+1</span>
            </div>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Add phone number"
              className="h-[48px] flex-1 rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              {...register("phoneNumber")}
            />
          </div>
          <div className="mt-1.5">
            {errors.phoneNumber && (
              <div className="text-red-600 text-sm">
                {errors.phoneNumber.message}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
            Password
          </label>

          <div className="relative mt-[6px]">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 pr-12 text-[14px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
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

          <div className="mt-1.5">
            {errors.password && (
              <div className="text-red-600 text-sm">{errors.password.message}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
            Confirm Password
          </label>

          <div className="relative mt-[6px]">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 pr-12 text-[14px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
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

          <div className="mt-1.5">
            {errors.confirmPassword && (
              <div className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-0.5 mb-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 rounded-[4px] border border-[#181818]/80 accent-[#005864]"
              {...register("acceptTerms")}
              onChange={(e) => {
                setValue("acceptTerms", e.target.checked, { shouldValidate: true });
              }}
            />
            <span className="text-[15px] leading-[19px] text-black/80">
              I accept the{" "}
              <a href="#" className="text-[#005864] font-[500]">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#005864] font-[500]">
                Privacy Policy
              </a>
            </span>
          </label>
          <div className="mt-1.5">
            {errors.acceptTerms && (
              <div className="text-red-600 text-sm">
                {errors.acceptTerms.message}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-[48px] mt-[2em] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99]"
        >
          Sign Up
        </button>

       

        <div className="mt-5 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">OR</div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        <div className="mt-5 flex items-center justify-between">
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

        <div className="mt-6 text-center text-[16px] leading-[22px] text-black/80">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#005864] font-[500]">
            Login
          </Link>
        </div>
        </div>
      </div>
    </form>
  );
}

