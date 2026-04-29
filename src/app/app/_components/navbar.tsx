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

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-2xl px-6 py-6 flex items-center justify-between shadow-sm">
      {/* Empty left space (as in design) */}
      <div />

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src="https://i.pravatar.cc/150?img=12" />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">Ryan Cooper</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/app/change-password">
              <KeyRound className="w-4 h-4 mr-1" />
              Change Password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => router.push("/auth/login")}
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}