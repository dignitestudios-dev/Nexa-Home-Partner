"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PasswordUpdatedModalProps {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function PasswordUpdatedModal({
  open,
  onClose,
  onContinue,
}: PasswordUpdatedModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onContinue?.();
      onClose();
      router.push("/auth/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [open, onClose, onContinue, router]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl p-10">

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#005864] flex items-center justify-center text-white text-2xl">
          ✓
        </div>

        <DialogHeader className="mt-6">
          <DialogTitle className="text-2xl font-semibold">
            Password Updated<br></br> Successfully
          </DialogTitle>

          <DialogDescription className="text-gray-500 mt-2">
            Your password has been updated successfully. 
          </DialogDescription>
        </DialogHeader>

       
    

      </DialogContent>
    </Dialog>
  );
}