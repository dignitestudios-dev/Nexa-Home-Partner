"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Ellipsis, AlertCircle } from "lucide-react";
import ConfirmActionModal from "@/app/app/_components/confirmation-modal";

/* ================= TYPES ================= */

type UserDetail = {
  id: number;
  name: string;
  email: string;
  role: string;
  purchasedDate: string;
  advancedCategory: string;
  categories: string[];
  status: "Active" | "Inactive";
  avatar: string;
};

type ConfirmModalType = null | "block" | "delete";

/* ================= SAMPLE DATA ================= */

const usersDatabase: Record<number, UserDetail> = {
  1: {
    id: 1,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    role: "Service Provider",
    purchasedDate: "09/02/2025",
    advancedCategory: "Advanced Category",
    categories: [
      "Window Cleaning",
      "Roof Cleaning",
      "Pressure Washing",
      "Power Washing",
      "Window Cleaning",
    ],
    status: "Active",
    avatar: "JM",
  },
  2: {
    id: 2,
    name: "Lila Hudson",
    email: "lila.hudson@yahoo.com",
    role: "Service Provider",
    purchasedDate: "01/01/2023",
    advancedCategory: "Advanced Category",
    categories: ["Plumbing", "Electrical", "HVAC"],
    status: "Active",
    avatar: "LH",
  },
  3: {
    id: 3,
    name: "Marcus Lee",
    email: "marcus.lee@gmail.com",
    role: "Service Provider",
    purchasedDate: "02/15/2023",
    advancedCategory: "Advanced Category",
    categories: ["Painting", "Drywall", "Flooring"],
    status: "Inactive",
    avatar: "ML",
  },
};

/* ================= PAGE ================= */

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalType>(null);

  const user = usersDatabase[userId];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F9FA] p-10 font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-4">
            User Not Found
          </h1>
          <Button
            onClick={() => router.back()}
            className="bg-[#005864] hover:bg-[#004750] text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleBlockUser = () => {
    console.log(`Blocked user: ${user.name}`);
    setConfirmModal(null);
    // Add API call here
  };

  const handleDeleteUser = () => {
    console.log(`Deleted user: ${user.name}`);
    setConfirmModal(null);
    // Add API call here
    router.push("/app/user-management");
  };

  return (
    <div className="min-h-screen">
      {/* Back Button & Title */}
      <div className="flex justify-between items-center mb-4 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading text-[#1C1C1C] tracking-tight">
            User Management
          </h1>
        </div>

        {/* Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 bg-[#005864] rounded-full text-white hover:bg-[#004750] transition-colors">
              <Ellipsis size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-[16px] border-none shadow-lg"
          >
            <DropdownMenuItem
              onClick={() => setConfirmModal("block")}
              className="cursor-pointer text-[16px] font-medium py-2 px-3 mb-1"
            >
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConfirmModal("delete")}
              className="cursor-pointer text-[16px] font-medium py-2 px-3 text-red-600"
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm p-8">
        <div className="flex gap-12">
          {/* Left Section - Avatar & Info */}
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="bg-[rgba(0,88,100,0.06)] rounded-[12px] w-90 p-8 mb-6 relative">
              <div className="flex items-center justify-center">
                <Avatar className="h-[105px] w-[105px]">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="bg-[#212121] text-white font-semibold text-[24px]">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* User Info */}
              <h2 className="text-[24px] font-semibold text-[#1A1A1A] text-center mb-1">
                {user.name}
              </h2>
              <p className="text-[16px] font-normal text-[#1A1A1A] text-center mb-1">
                {user.email}
              </p>
              <p className="text-[16px] font-normal text-[rgba(0,0,0,0.7)] text-center">
                {user.role}
              </p>
            </div>
          </div>

          {/* Right Section - Details & Categories */}
          <div className="flex-1">
            {/* Purchased Date & Status */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[20px] font-semibold text-[#1A1A1A]">
                  Purchased Date
                </h3>
                <p className="text-[16px] font-normal text-[rgba(0,0,0,0.7)]">
                  {user.purchasedDate}
                </p>
              </div>
              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-[16px] font-semibold ${
                    user.status === "Active"
                      ? "bg-[#16BC4E] text-white"
                      : "bg-[#FF0000] text-white"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-4">
                Advance Category
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-[#005864] text-white px-4 py-2 rounded-full text-[16px] font-light text-center"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={!!confirmModal}
        type={confirmModal}
        userName={user.name}
        onClose={() => setConfirmModal(null)}
        onConfirm={
          confirmModal === "block" ? handleBlockUser : handleDeleteUser
        }
      />
    </div>
  );
}
