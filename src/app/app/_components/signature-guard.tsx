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
  const [currentScreen, setCurrentScreen] = useState<'agreement' | 'upload' | 'type'>('agreement');

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
        setCurrentScreen('agreement');
      }
    }
  }, [user]);

  const openUploadModal = () => {
    setCurrentScreen('upload');
  };

  const openTypeModal = () => {
    setCurrentScreen('type');
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
      toast.error("Please upload a valid image file (JPG, PNG, JPEG). GIF is not allowed.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
    setCurrentScreen('agreement');
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
    setCurrentScreen('agreement');
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
            setCurrentScreen('agreement');
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={`w-full transition-all duration-300 rounded-[20px] bg-white p-10 z-[100] ${currentScreen === 'agreement' ? 'max-w-[900px] max-h-[95vh] overflow-y-auto' : 'max-w-[620px] max-h-[90vh] overflow-y-auto'
            }`}
        >
          {currentScreen === 'agreement' && (
            <>
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

              {(savedSignaturePreview || uploadedImagePreview) && (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFE0E0] bg-[#F9FCFC] p-4 h-[120px]">
                  <span className="text-xs font-medium text-gray-500 mb-2">Signature Preview</span>
                  <img
                    src={savedSignaturePreview || uploadedImagePreview || ""}
                    alt="Signature Preview"
                    className="max-h-[70px] max-w-full object-contain"
                  />
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmitSignature}
                disabled={isSubmitting}
                className="mt-6 h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852] flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit & Accept Agreement
              </Button>
            </>
          )}

          {currentScreen === 'upload' && (
            <>
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
                <p className="text-center text-[13px] text-black/50 mt-1">
                  Allowed formats: JPG, PNG, JPEG
                </p>

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

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentScreen('agreement')}
                    className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveImage}
                    disabled={!uploadedImagePreview}
                    className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Image
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentScreen === 'type' && (
            <>
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

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentScreen('agreement')}
                    className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveTypedSignature}
                    disabled={!typedSignature.trim()}
                    className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Signature
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
