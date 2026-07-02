"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { updateProfile, clearError } from "@/lib/slices/authSlice";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";

// Define the edit profile schema with overview and optional profile picture
const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(7, "Phone number is required")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Invalid phone number"),
  overview: z.string().optional(),
  profilePicture: z.any().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, success } = useSelector(
    (state: RootState) => state.auth,
  );
  // Initialize preview URL with user's existing profile picture
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>(
    user?.profilePicture || user?.data?.profilePicture?.location || "",
  );
  const phoneNumber: string = user?.data?.phone || "";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    getValues
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: {

      name: user?.fullName || user?.data?.name || "",
      phoneNumber: phoneNumber.replace("+1", "") || "",

    },
  });

  // Keep form in sync with Redux user state

  //  if (user) {
  //     const phone = user.phone || user.data?.phone || "";
  //     reset({
  //       name: user.fullName || user.data?.name || "",
  //       phoneNumber: phone.replace("+1", ""), // ✅ +1 hata ke show karo
  //       overview: user.overview || "",
  //     });
  //     setLogoPreviewUrl(
  //       user.profilePicture || user.data?.profilePicture?.location || "",
  //     );
  //   }
  // useEffect(() => {
  //   if (user) {
  //     const phone = user.phone || user.data?.phone || "";
  //     reset({
  //       name: user.fullName || user.data?.name || "",
  //       phoneNumber: phone.replace("+1", ""), // ✅ +1 hata ke show karo
  //       overview: user.overview || "",
  //     });
  //     setLogoPreviewUrl(
  //       user.profilePicture || user.data?.profilePicture?.location || "",
  //     );
  //   }
  // }, [user, reset]);
  // Handle Image Selection and Preview
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ❌ GIF validation
    if (file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
      toast.error("GIF images are not allowed");
      return;
    }

    // ❌ Size validation
    const minSize = 10 * 1024; // 10KB
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (file.size < minSize) {
      toast.error("Image is too small (min 10KB)");
      console.log(file.size, "Image is too small (min 10KB)")
      return;
    }
    console.log(file.size, "Image is too large (max 25MB)")
    if (file.size > maxSize) {
      toast.error("Image is too large (max 25MB)");
      return;
    }

    // ❌ Resolution validation
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

      // ✅ valid image
      setValue("profilePicture", file, { shouldValidate: true });
      setLogoPreviewUrl(URL.createObjectURL(file));
    };

    img.onerror = () => {
      toast.error("Invalid image file");
    };

    img.src = objectUrl;
  };
  const onSubmit = async (data: EditProfileFormData) => {
    dispatch(clearError());

    const formData = new FormData();

    // ✅ Name — sirf tab bhejo jab change hua ho
    const originalName = user?.fullName || user?.data?.name || "";
    if (data.name !== originalName) {
      formData.append("name", data.name);
    }

    // ✅ Phone — sirf tab bhejo jab change hua ho
    const originalPhone = (user?.phone || user?.data?.phone || "").replace(
      "+1",
      "",
    );
    if (data.phoneNumber !== originalPhone) {
      formData.append("phone", `+1${data.phoneNumber}`);
    }

    // ✅ Image — sirf tab bhejo jab nai file select ki ho
    if (data.profilePicture instanceof File) {
      formData.append("profilePicture", data.profilePicture);
    } else if (
      data.profilePicture instanceof FileList &&
      data.profilePicture.length > 0
    ) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    // ✅ Agar kuch bhi change nahi hua toh API call ki zarurat nahi

    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success(result.payload.message || "Profile updated successfully");

      const newImage =
        result.payload?.data?.profilePicture?.location ||
        result.payload?.data?.profilePicture ||
        null;

      if (newImage) {
        setLogoPreviewUrl(newImage);
      }

      router.push("/app/dashboard");
    } else {
      toast.error((result.payload as string) || "Failed to update profile");
    }
  };
  // Cleanup preview URL on unmount
  // useEffect(() => {
  //   return () => {
  //     if (logoPreviewUrl && logoPreviewUrl.startsWith("blob:")) {
  //       URL.revokeObjectURL(logoPreviewUrl);
  //     }
  //   };
  // }, [logoPreviewUrl]);

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-100px)] py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[500px] p-8 bg-white rounded-[24px] shadow-sm border border-gray-100"
      >
        <div className="text-center">
          <h1 className="text-[32px] leading-[40px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
            Edit Profile
          </h1>
          <p className="mt-2 text-[16px] leading-[22px] text-black/60">
            Update your account details below.
          </p>
        </div>

        <div className="mt-8">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <label
              htmlFor="profilePicture"
              className="w-[120px] h-[120px] rounded-full border border-dashed border-[#005864] bg-[#005864]/5 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-[#005864]/10"
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
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="profilePicture"
              className="mt-3 text-[16px] font-medium text-[#005864] underline underline-offset-4 cursor-pointer"
            >
              Change Profile Image
            </label>
            <p className="mt-1.5 text-[13px] text-black/50">
              Allowed formats: JPG, PNG, JPEG
            </p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-[14px] font-medium leading-[22px] text-[#1C1C1C] mb-1.5 block">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="h-[52px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/40 focus-visible:ring-1 focus-visible:ring-[#005864]/30 shadow-none"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email (Always Read-only in Profile) */}
            <div>
              <label className="text-[14px] font-medium leading-[22px] text-[#1C1C1C] mb-1.5 block">
                Email Address
              </label>
              <Input
                type="email"
                readOnly
                value={user?.email || user?.data?.email || ""}
                className="h-[52px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/40 focus-visible:ring-0 cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Email cannot be changed
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[14px] font-medium leading-[22px] text-[#1C1C1C] mb-1.5 block">
                Phone Number
              </label>
              <div className="flex gap-2.5">
                <div className="h-[52px] w-[90px] rounded-[12px] bg-[#F8F8F8] flex items-center justify-center gap-2 text-[16px] font-medium text-[#1C1C1C] border border-transparent">
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
                  className="h-[52px] flex-1 rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/40 focus-visible:ring-1 focus-visible:ring-[#005864]/30 shadow-none"
                  {...register("phoneNumber")}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    e.target.value = digits;

                    setValue("phoneNumber", digits, {
                      shouldValidate: true,
                    });
                  }}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Overview / Bio */}
            {/* <div>
              <label className="text-[14px] font-medium leading-[22px] text-[#1C1C1C] mb-1.5 block">
                Overview / Bio
              </label>
              <textarea
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full rounded-[12px] bg-[#F8F8F8] border-0 p-4 text-[16px] placeholder:text-[#181818]/40 focus:outline-none focus:ring-1 focus:ring-[#005864]/30 transition-all resize-none"
                {...register("overview")}
              />
            </div> */}

            {/* Global Error Message */}
            {/* {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] text-center font-medium">
                {error}
              </div>
            )} */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] mt-6 bg-[#005864] rounded-[14px] text-white text-[16px] font-semibold capitalize hover:bg-[#004a54] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
