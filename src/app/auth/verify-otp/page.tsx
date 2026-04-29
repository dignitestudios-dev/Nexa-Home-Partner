"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";

type OtpFormData = z.infer<typeof otpSchema>;

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const email = searchParams.get("email") || "lucasbenjamin@gmail.com";

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const current = otp.split("");
    current[index] = value.slice(-1);

    const newOtp = current.join("").padEnd(5, "");
    setValue("otp", newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const otpArray = otp.split("");

    if (e.key === "Backspace") {
      e.preventDefault();

      if (otpArray[index]) {
        // clear current
        otpArray[index] = "";
        setValue("otp", otpArray.join(""));
      } else if (index > 0) {
        // move back + clear previous
        otpArray[index - 1] = "";
        setValue("otp", otpArray.join(""));

        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 5);
    if (!digits) return;

    const nextOtp = digits.padEnd(5, "");
    setValue("otp", nextOtp);

    const nextFocusIndex = Math.min(digits.length, 4);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleSubmitOtp = (data: OtpFormData) => {
    console.log("OTP SUBMIT:", data);
    router.push("/auth/change-password");
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href="/auth/forgot-password"
        className="absolute left-0 top-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <form
        onSubmit={handleSubmit(handleSubmitOtp)}
        className="w-full max-w-[496px] min-h-[560px] mx-auto"
      >
        <div className="text-center mt-[122px]">
          <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
            Verification
          </h1>

          <p className="mt-2 text-[16px] leading-[22px] text-black/80">
            Enter the code sent to{" "}
            <span className="text-[#005864]">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="mt-[68px] flex justify-center gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={otp[i] || ""}
                type="text"
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="w-[60px] h-[60px] text-center text-[24px] font-semibold rounded-[12px] bg-[#F8F8F8] border border-transparent focus:border-[#005864] focus:outline-none text-[#005864]"
              />
            ))}
        </div>

        <div className="min-h-[20px] mt-2 text-center">
          {errors.otp && (
            <div className="text-red-600 text-sm">{errors.otp.message}</div>
          )}
        </div>

        <p className="text-[16px] leading-[22px] text-black/80 mt-4 text-center">
          Didn&apos;t receive code?{" "}
          <button
            type="button"
            disabled={timer > 0}
            className={`font-medium text-[#005864] ${
              timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </p>

        <button
          type="submit"
          className="w-[388px] mx-auto block h-[48px] mt-8 bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99]"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-[560px]" />}>
      <VerificationContent />
    </Suspense>
  );
}
