"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Lucide Icons
import { Clock, LayoutPanelLeft, UserRound, Filter } from "lucide-react";
import { LucideIcon } from "lucide-react";

/* ================= TYPES ================= */

type StatItem = {
  title: string;
  value: string;
  icon: LucideIcon;
};

type CategoryRow = {
  category: string;
  total: number;
  active: number;
};

type CategoryTableProps = {
  data: CategoryRow[];
};

/* ================= DATA ================= */

const stats: StatItem[] = [
  { title: "Avg Response Time", value: "56,879", icon: Clock },
  { title: "Avg Responses Per Lead", value: "56,879", icon: LayoutPanelLeft },
  { title: "Total Leads Purchased", value: "56,879", icon: UserRound },
];

const tableData: CategoryRow[] = [
  { category: "Window Cleaning", total: 98, active: 56 },
  { category: "Plumbing Services", total: 98, active: 56 },
  { category: "Electrical Services", total: 98, active: 56 },
  { category: "Handyman Services", total: 98, active: 56 },
  { category: "Pest Control", total: 98, active: 56 },
  { category: "Appliance Repair", total: 98, active: 56 },
  { category: "Roofing Services", total: 98, active: 56 },
  { category: "Pressure Washing", total: 98, active: 56 },
  { category: "Gutter Services", total: 98, active: 56 },
  { category: "Painting Services", total: 98, active: 56 },
  { category: "Outdoor Living", total: 98, active: 56 },
];

/* ================= COMPONENTS ================= */

const PerformanceFilter = () => (
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
        All Categories
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Highest Active
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Lowest Active
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CategoryTable = ({ data }: CategoryTableProps) => (
  <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
    <Table>
      <TableHeader className="border-none">
        <TableRow className="bg-[#F8F9FA] hover:bg-[#F8F9FA] border-none">
          <TableHead className="px-10 py-6 text-[13px] font-bold text-[#1A1A1A] w-[50%] h-[64px]">
            Category
          </TableHead>
          <TableHead className="text-[13px] font-bold text-[#1A1A1A] text-center h-[64px]">
            Total Experts
          </TableHead>
          <TableHead className="px-10 text-[13px] font-bold text-[#1A1A1A] text-right h-[64px]">
            Active Experts
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors"
          >
            <TableCell className="px-10 py-5 text-[14px] font-medium text-gray-600">
              {row.category}
            </TableCell>
            <TableCell className="text-[14px] font-semibold text-gray-700 text-center">
              {row.total}
            </TableCell>
            <TableCell className="px-10 text-[14px] font-semibold text-gray-700 text-right">
              {row.active}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

/* ================= PAGE ================= */

export default function LeadPerformancePage() {
  return (
    <div className="min-h-screen bg-[#F0F9FA] p-10 font-sans">
      {/* Title */}
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Lead Performance Analytics
      </h1>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-12">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="min-w-[320px] flex-1 border-none shadow-none rounded-[32px] bg-white"
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
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
          Experts Signed Up Per Category
        </h2>
        <PerformanceFilter />
      </div>

      {/* Table */}
      <CategoryTable data={tableData} />
    </div>
  );
}
