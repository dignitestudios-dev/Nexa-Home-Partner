"use client";

import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { completeProfile, clearError, logout } from "@/lib/slices/authSlice";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { completeProfileSchema } from "@/lib/schemas/auth.schema";
import { getLocalStorage } from "@/utils/localStorage";


type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    email: reduxEmail,
    loading,
    error,
    success,
  } = useSelector((state: RootState) => state.auth);

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });
  const nameValue = watch("name") || "";
  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    // remove redux data + token
    dispatch(logout());

    // redirect login page
    router.push("/auth/login");
  };
  // Sync form with user state when it changes
  // useEffect(() => {
  //   if (user) {
  //     reset({
  //       name:  "",
  //       phoneNumber: user.phone || "",
  //     });
  //   }
  // }, [user, reset]);

  // Handle Image Selection and Preview
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Clear previous preview
  //     if (logoPreviewUrl) {
  //       URL.revokeObjectURL(logoPreviewUrl);
  //     }

  //     // Update form value
  //     setValue("profilePicture", file, { shouldValidate: true });

  //     // Create new preview
  //     setLogoPreviewUrl(URL.createObjectURL(file));
  //   }
  // };
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ❌ Only image check
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // ❌ Block GIF explicitly (if needed)
    if (file.type === "image/gif") {
      toast.error("GIF images are not allowed");
      return;
    }

    const minSize = 10 * 1024;
    const maxSize = 25 * 1024 * 1024;

    if (file.size < minSize) {
      toast.error("Image is too small (min 10KB)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image is too large (max 25MB)");
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      URL.revokeObjectURL(objectUrl);

      if (width < 256 || height < 256) {
        toast.error("Image resolution must be at least 256x256 px");
        return;
      }

      setValue("profilePicture", file, { shouldValidate: true });
      setLogoPreviewUrl(URL.createObjectURL(file));
    };

    img.onerror = () => {
      toast.error("Invalid image file");
    };

    img.src = objectUrl;
  };
  const onSubmit = async (data: CompleteProfileFormData) => {
    console.log("Form data:", data); // CHECK KARO name aa raha hai?
    // Clear previous errors
    dispatch(clearError());
    // Prepare FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", `+1${data.phoneNumber}`);
    console.log(formData, "formData");

    // Handle profilePicture (either File or FileList)
    if (data.profilePicture instanceof File) {
      formData.append("profilePicture", data.profilePicture);
    } else if (
      data.profilePicture instanceof FileList &&
      data.profilePicture.length > 0
    ) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    // Call API
    const result = await dispatch(completeProfile(formData));
    if (completeProfile.fulfilled.match(result)) {
      toast.success(result.payload.message || "Profile completed successfully");
    } else {
      toast.error((result.payload as string) || "Failed to complete profile");
    }
  };

  // Redirect to dashboard on success
  useEffect(() => {
    if (success) {
      router.push("/app/dashboard");
    }
  }, [success, router]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);
  const [displayEmail, setDisplayEmail] = useState<string | null>(null);
  useEffect(() => {
    const user = getLocalStorage("user");
    console.log(user, "user")
    if (user?.email) {
      setDisplayEmail(user.email);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[388px] py-6"
    >
      <div className="text-center">
        <h1 className="text-[32px] leading-[40px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          Complete Profile
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          Enter your details below to complete your profile.
        </p>
      </div>

      <div className="mt-4">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="profilePicture"
            className="w-[100px] h-[100px] rounded-full border border-dashed border-[#005864] bg-[#005864]/6 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[44px] mt-[-0.4em] leading-none text-[#005864]">
                +
              </span>
            )}
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
          <label
            htmlFor="profilePicture"
            className="mt-2 text-[16px] font-[500] text-[#005864] underline underline-offset-2 cursor-pointer"
          >
            Upload Profile Image
          </label>
          {errors.profilePicture && (
            <p className="text-red-600 text-sm mt-1">
              {errors.profilePicture.message as string}
            </p>
          )}
        </div>

        <div className="mt-3">
          {/* Full Name */}
          <div className="mb-4">
            <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
              Full Name
            </label>

            <Input
              type="text"
              placeholder="Ryan Cooper"
              minLength={2}
              maxLength={64}
              defaultValue={user?.fullName || ""}
              className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
              {...register("name")}
            />

            <div className="flex items-center justify-end  mt-1">


              <p className="text-[12px] text-[#181818]/50">
                {nameValue.length}/64
              </p>
            </div>

            {errors.name && (
              <div className="text-red-600 text-sm mt-1.5">
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="mb-4">
            <label className="text-[14px] font-[500] leading-[22px] text-[#1C1C1C]">
              Email
            </label>
            <Input
              type="email"
              readOnly
              value={displayEmail as string}
              className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[14px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none cursor-not-allowed opacity-70"
            />
          </div>

          {/* Phone Number */}
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
                />
                <span>+1</span>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={10}

                className="h-[48px] flex-1 rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
                {...register("phoneNumber")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  e.target.value = digits;
                  setValue("phoneNumber", digits, { shouldValidate: true });
                }}
              />
            </div>
            {errors.phoneNumber && (
              <div className="text-red-600 text-sm mt-1.5">
                {errors.phoneNumber.message}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="mt-0.5 mb-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-5 w-5 rounded-[4px] border border-[#181818]/80 accent-[#005864]"
              />

              <span className="text-[15px] leading-[19px] text-black/80">
                I accept the{" "}

                <a
                  href="https://www.nexahomeapp.com/partner/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005864] font-[500]"
                >
                  Terms & Conditions
                </a>{" "}

                and{" "}

                <a
                  href="https://www.nexahomeapp.com/partner/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005864] font-[500]"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] mt-[2em] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Complete Profile"
            )}
          </button>

          <div className="mt-6 text-center text-[16px] leading-[22px] text-black/80">
            Already have an account?{" "}
            <button
              onClick={handleLogout}
              className="text-[#005864] font-[500] cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
