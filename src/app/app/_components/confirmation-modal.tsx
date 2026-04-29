// components/ConfirmActionModal.tsx

"use client";

import { TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ConfirmActionModalProps = {
  open: boolean;
  type: "block" | "delete" | null;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmActionModal({
  open,
  type,
  userName,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  const isBlock = type === "block";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[360px] max-w-[360px] rounded-[16px] p-6 shadow-xl border-none gap-0">
        {/* Danger Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-[42px] h-[42px] bg-[#F01A1A] rounded-full flex items-center justify-center">
            <TriangleAlert size={24} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <DialogHeader className="space-y-2 text-center mb-6">
          <DialogTitle className="text-[24px] font-bold text-[#181818] capitalize">
            {isBlock ? "Block User" : "Delete User"}
          </DialogTitle>

          <DialogDescription className="text-[16px] font-normal text-[#565656] leading-normal">
            {isBlock
              ? `Are you sure you want to block ${userName}?`
              : `Are you sure you want to delete ${userName}? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#ECECEC] text-[#181818] rounded-[12px] font-semibold text-[12px] hover:bg-gray-300 transition-colors"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#F01A1A] text-white rounded-[12px] font-semibold text-[12px] hover:bg-red-700 transition-colors"
          >
            {isBlock ? "Block" : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
