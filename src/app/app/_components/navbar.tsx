"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

import { logout } from "@/lib/slices/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FaUserEdit } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const profile = user?.data;
  console.log(user);
  const dispatch = useDispatch<AppDispatch>();

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    // remove redux data + token
    dispatch(logout());

    // redirect login page
    router.push("/auth/login");
  };


  return (
    <div className="w-full  rounded-2xl px-6 py-6 flex items-center justify-between ">
      <p className="text-xl font-medium">Welcome,<span className="text-[#004D54] font-semibold">{profile?.name || "User"}</span></p>
      <div />

      {/* USER DROPDOWN */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src={profile?.profilePicture?.location || ""} />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>

            <span className="text-sm font-medium text-gray-700">
              {profile?.name || "User"}
            </span>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">


          <DropdownMenuItem asChild>
            <Link href="/app/edited-profile">
              <FaUserEdit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </DropdownMenuItem>
          {/* CHANGE PASSWORD */}
          <DropdownMenuItem asChild>
            <Link href="/app/change-password">
              <KeyRound className="w-4 h-4 mr-2" />
              Change Password
            </Link>
          </DropdownMenuItem>
          {/* LOGOUT */}
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}