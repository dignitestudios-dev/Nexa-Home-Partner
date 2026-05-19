"use client";

import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccountCreatedModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountCreatedModal({
  open,
  onClose,
}: AccountCreatedModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[515px] max-w-[calc(100%-2rem)] rounded-[24px] bg-white p-0 border-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-10 h-10 inline-flex items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="px-[43px] py-[46px] flex flex-col items-center">
       <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
  <X className="text-red-500" size={40} strokeWidth={3.2} />
</div>

          <DialogTitle className="mt-8 text-[32px] leading-[40px] tracking-[-0.008em] text-center font-semibold text-[#1C1C1C] capitalize">
  Email Already in Use
</DialogTitle>

<DialogDescription className="mt-4 text-[18px] leading-[23px] text-center text-black/80">
  This email address is already associated with another account. Please use a different email to continue.
</DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}

