"use client";

import {
  LayoutDashboard,
  Map,
  Handshake,
  ArrowUpToLine,
  CircleDollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/app/dashboard",
  },
  {
    label: "Category & Homeowner",
    icon: Map,
    link: "/app/category-vendor-insights",
  },
  {
    label: "Referral Tracking",
    icon: Handshake,
    link: "/app/referral-tracking",
  },
  { label: "CSV Upload", icon: ArrowUpToLine, link: "/app/csv-upload" },
  {
    label: "Revenue Summary",
    icon: CircleDollarSign,
    link: "/app/revenue-summary",
  },
  {
    label: "Terms & Conditions",
    icon: FileText,
    link: "/app/terms-and-conditions",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen overflow-y-auto w-[300px] bg-[#004D54] text-white flex flex-col p-6 shadow-xl hide-scrollbar">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <Image
          src="/asset/sidebarlogo.png"
          alt="NexaHome Logo"
          width={80}
          height={100}
          className="w-[12em] h-20 object-contain"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;
          return (
            <Link
              key={i}
              href={item.link}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-full cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#00A299] to-[#40B480] text-white shadow-lg"
                  : "hover:bg-white/5 text-gray-100/90"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span
                className={`text-[14px] ${isActive ? "font-normal" : "font-normal"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
