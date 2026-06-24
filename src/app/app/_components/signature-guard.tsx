"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { uploadSignature } from "@/lib/api/dashboard.api";
import { getMe } from "@/lib/slices/authSlice";
import { toast } from "sonner";

interface SignatureGuardProps {
  children: React.ReactNode;
}

export default function SignatureGuard({ children }: SignatureGuardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [savedSignaturePreview, setSavedSignaturePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const hasSignature = !!(user.signature || user.data?.signature);
      setIsAgreementModalOpen(!hasSignature);
      if (hasSignature) {
        setIsUploadModalOpen(false);
        setIsTypeModalOpen(false);
      }
    }
  }, [user]);

  const openUploadModal = () => {
    setIsAgreementModalOpen(false);
    setIsUploadModalOpen(true);
  };

  const openTypeModal = () => {
    setIsAgreementModalOpen(false);
    setIsTypeModalOpen(true);
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
      setUploadedImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!uploadedImagePreview) {
      return;
    }
    setSavedSignaturePreview(null);
    setIsUploadModalOpen(false);
    setIsAgreementModalOpen(true);
  };

  const handleSaveTypedSignature = () => {
    if (!typedSignature.trim()) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "italic 48px 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive";
      ctx.fillStyle = "#005864";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);

      const signatureImage = canvas.toDataURL("image/png");
      setSavedSignaturePreview(signatureImage);
    }

    setUploadedFile(null);
    setUploadedImagePreview(null);
    setUploadedImageName("");
    setIsTypeModalOpen(false);
    setIsAgreementModalOpen(true);
  };

  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  };

  const handleSubmitSignature = async () => {
    if (!uploadedFile && !savedSignaturePreview) {
      toast.error("Please provide a signature first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      let fileToUpload: File | null = null;

      if (uploadedFile) {
        fileToUpload = uploadedFile;
      } else if (savedSignaturePreview) {
        fileToUpload = await dataUrlToFile(savedSignaturePreview, "signature.png");
      }

      if (!fileToUpload) {
        throw new Error("No signature file found.");
      }

      formData.append("signatureFile", fileToUpload);
      const signatureText = user?.fullName || user?.data?.name || "Partner Signature";
      formData.append("signature", signatureText);

      await uploadSignature(formData);
      toast.success("Agreement signed successfully.");

      await dispatch(getMe());
      setIsAgreementModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {children}

      <Dialog
        open={isAgreementModalOpen}
        onOpenChange={(open) => {
          const hasSignature = !!(user?.signature || user?.data?.signature);
          if (hasSignature) {
            setIsAgreementModalOpen(open);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-[900px] rounded-[24px] bg-white p-10 z-[100]"
        >
          <DialogTitle className="text-[24px] font-[700] leading-[30px] text-black">
            Agreement
          </DialogTitle>

          <DialogDescription className="mt-3 h-[448px] overflow-y-auto pr-2 text-[16px] font-[400] leading-[32px] text-[rgba(24,24,24,0.8)]">
            Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet
            enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus
            risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Quis amet
            imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
            vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur. Diam
            aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet
            imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
            vulputate aliquet eu. Quis amet imperdiet ut molestie luctus risus
            lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum
            dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus
            vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia.
            Mauris vel mus at urna vulputate aliquet eu. Quis amet imperdiet ut
            molestie luctus risus lacinia. Mauris vel mus at urna vulputate
            aliquet eu. Lorem ipsum dolor sit amet consectetur.
          </DialogDescription>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              onClick={openUploadModal}
              className="h-12 rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] capitalize hover:bg-[rgba(0,88,100,0.12)]"
            >
              Upload Image
            </Button>
            <Button
              type="button"
              onClick={openTypeModal}
              className="h-12 rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852]"
            >
              Type Signature
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleSubmitSignature}
            disabled={isSubmitting}
            className="mt-6 h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852] flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit & Accept Agreement
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);
          if (!open) {
            const hasSignature = !!(user?.signature || user?.data?.signature);
            if (!hasSignature) {
              setIsAgreementModalOpen(true);
            }
          }
        }}
      >
        <DialogContent
          className="w-full max-w-[620px] rounded-[24px] bg-white p-8 z-[110]"
        >
          <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
            Upload Image
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
            Select an image file, preview it, then click save.
          </DialogDescription>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelection}
          />

          <div className="mt-4 space-y-4">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
            >
              Choose Image
            </Button>

            <div className="h-[250px] rounded-2xl border border-dashed border-[#CFE0E0] bg-[#F9FCFC] p-3">
              {uploadedImagePreview ? (
                <img
                  src={uploadedImagePreview}
                  alt="Selected upload preview"
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No image selected yet
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSaveImage}
              disabled={!uploadedImagePreview}
              className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTypeModalOpen}
        onOpenChange={(open) => {
          setIsTypeModalOpen(open);
          if (!open) {
            const hasSignature = !!(user?.signature || user?.data?.signature);
            if (!hasSignature) {
              setIsAgreementModalOpen(true);
            }
          }
        }}
      >
        <DialogContent
          className="w-full max-w-[620px] rounded-[24px] bg-white p-8 z-[110]"
        >
          <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
            Type Signature
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
            Type your name below, choose cursive style, then click save.
          </DialogDescription>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Type your full name"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#CFE0E0] bg-[#F9FCFC] px-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005864]"
            />

            <Button
              type="button"
              onClick={handleSaveTypedSignature}
              disabled={!typedSignature.trim()}
              className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Signature
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
