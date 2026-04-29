"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Lucide Icons
import { BadgeCheck, Filter } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ExpertTable } from "./_components/ExpertTable";

/* ================= TYPES ================= */

type StatItem = {
  title: string;
  value: string;
  icon: LucideIcon;
};

/* ================= DATA ================= */

const stats: StatItem[] = [
  { title: "Total Verified Experts", value: "1,245", icon: BadgeCheck },
  { title: "Active This Month", value: "892", icon: BadgeCheck },
  { title: "Badge Renewals", value: "156", icon: BadgeCheck },
];

type ExpertRow = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  badgePurchaseDate: string;
  status: "Active" | "Inactive";
  avatar: string;
};

const expertData: ExpertRow[] = [
  {
    id: 1,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    joinDate: "09/09/2025",
    badgePurchaseDate: "12/12/2025",
    status: "Active",
    avatar: "JM",
  },
  {
    id: 2,
    name: "Lila Hudson",
    email: "lila.hudson@yahoo.com",
    joinDate: "01/01/2023",
    badgePurchaseDate: "06/01/2023",
    status: "Active",
    avatar: "LH",
  },
  {
    id: 3,
    name: "Marcus Lee",
    email: "marcus.lee@gmail.com",
    joinDate: "02/15/2023",
    badgePurchaseDate: "08/15/2023",
    status: "Inactive",
    avatar: "ML",
  },
  {
    id: 4,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    joinDate: "09/09/2025",
    badgePurchaseDate: "12/12/2025",
    status: "Inactive",
    avatar: "JM",
  },
  {
    id: 5,
    name: "Sophie Turner",
    email: "sophie.turner@outlook.com",
    joinDate: "03/22/2024",
    badgePurchaseDate: "09/22/2024",
    status: "Active",
    avatar: "ST",
  },
  {
    id: 6,
    name: "Benny Rodriguez",
    email: "benny.rodriguez@aol.com",
    joinDate: "04/10/2024",
    badgePurchaseDate: "10/10/2024",
    status: "Inactive",
    avatar: "BR",
  },
  {
    id: 7,
    name: "Emma Watson",
    email: "emma.watson@gmail.com",
    joinDate: "05/05/2024",
    badgePurchaseDate: "11/05/2024",
    status: "Active",
    avatar: "EW",
  },
  {
    id: 8,
    name: "George Smith",
    email: "george.smith@yahoo.com",
    joinDate: "06/18/2024",
    badgePurchaseDate: "12/18/2024",
    status: "Active",
    avatar: "GS",
  },
  {
    id: 9,
    name: "Olivia Brown",
    email: "olivia.brown@outlook.com",
    joinDate: "07/12/2024",
    badgePurchaseDate: "01/12/2025",
    status: "Active",
    avatar: "OB",
  },
  {
    id: 10,
    name: "David Beckham",
    email: "david.beckham@gmail.com",
    joinDate: "08/21/2024",
    badgePurchaseDate: "02/21/2025",
    status: "Active",
    avatar: "DB",
  },
  {
    id: 11,
    name: "Natalie Portman",
    email: "natalie.portman@aol.com",
    joinDate: "09/30/2024",
    badgePurchaseDate: "03/30/2025",
    status: "Active",
    avatar: "NP",
  },
  {
    id: 12,
    name: "Chris Evans",
    email: "chris.evans@yahoo.com",
    joinDate: "10/05/2024",
    badgePurchaseDate: "04/05/2025",
    status: "Active",
    avatar: "CE",
  },
];

/* ================= COMPONENTS ================= */

const ExpertFilter = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="bg-[#005864] hover:bg-[#004750] text-white w-10 h-10 p-0 rounded-lg shadow-sm focus-visible:ring-0 transition-colors">
        <Filter size={18} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-48 rounded-xl border-none shadow-lg"
    >
      <DropdownMenuItem className="cursor-pointer">
        All Experts
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Active Only
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Inactive Only
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ================= PAGE ================= */

export default function VerifiedExpertsPage() {
  return (
    <div className="min-h-screen bg-[#EAFCFF] px-0 font-sans">
      {/* Background Gradient Effect */}
      {/* <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[569px] h-[549px] rounded-full blur-[400px] opacity-30"
          style={{
            background: "linear-gradient(180deg, #D7DF23 0%, #005864 100%)",
            right: "-100px",
            bottom: "200px",
          }}
        />
      </div> */}

      {/* Title */}
      <h1 className="heading text-[#1C1C1C] my-4 tracking-tight ">
        Verified Experts
      </h1>

      {/* Stats */}
      {/* <div className="flex flex-wrap gap-6 mb-12 relative z-10">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="min-w-[300px] flex-1 border-none shadow-none rounded-[32px] bg-white"
          >
            <CardContent className="p-6 flex items-center gap-5">
              <div className="bg-[#EAF5F6] w-[64px] h-[64px] rounded-[24px] flex items-center justify-center shrink-0">
                <item.icon
                  className="text-[#005864]"
                  size={26}
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <p className="text-[12px] font-medium text-gray-500 mb-1 leading-tight">
                  {item.title}
                </p>
                <h2 className="text-[32px] font-bold text-[#1A1A1A] tracking-tight leading-none">
                  {item.value}
                </h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Header */}
      {/* <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
          All Verified Experts
        </h2>
        <ExpertFilter />
      </div> */}

      {/* Table */}
      <div className="relative z-10">
        <ExpertTable data={expertData} />
      </div>
    </div>
  );
}
