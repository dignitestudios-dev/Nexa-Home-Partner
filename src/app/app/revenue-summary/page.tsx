"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingUp as TrendingIcon,
  ChevronDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  { title: "Total Revenue", value: "56,879", icon: TrendingUp },
];

const revenueData = [
  { month: "Jan", revenue: 120, target: 80 },
  { month: "Feb", revenue: 210, target: 130 },
  { month: "Mar", revenue: 170, target: 190 },
  { month: "Apr", revenue: 280, target: 210 },
  { month: "May", revenue: 420, target: 260 },
  { month: "Jun", revenue: 360, target: 310 },
  { month: "July", revenue: 500, target: 340 },
  { month: "Aug", revenue: 430, target: 380 },
  { month: "Sep", revenue: 390, target: 360 },
  { month: "Oct", revenue: 470, target: 400 },
  { month: "Nov", revenue: 530, target: 440 },
  { month: "Dec", revenue: 560, target: 470 },
];

export default function RevenueSummaryPage() {
  return (
    <div className="min-h-screen">
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Revenue Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white"
          >
            <CardContent className="p-0">
              <div className="p-5 flex items-center gap-4">
                <div className="bg-[#E6EEEE] p-4 rounded-[14px]">
                  <item.icon
                    className="w-7 h-7 text-[#004D4D]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-500 mb-1">
                    {item.title}
                  </p>
                  <h2 className="text-[24px] leading-none font-[600] text-[#1A1A1A] tracking-tight">
                    {item.value}
                  </h2>
                </div>
              </div>
              <div className="bg-[#005864] py-3 px-5 flex items-center gap-2 text-white font-medium text-sm">
                <TrendingIcon className="w-4 h-4" />
                12 increase this month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-2">
        <Card className="mx-auto h-[636px] w-full max-w-[100em] rounded-[24px] border-none bg-white p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-[700] text-[#1A1A1A]">
              Revenue Analysis
            </h2>
            <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-semibold text-[#005864]">
              Monthly <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3 h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 12, right: 12, left: 0, bottom: 16 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A6670" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#0A6670" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D7DF23" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#D7DF23" stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="6 6" stroke="#D6DDE2" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7C7C7C", fontSize: 13, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7C7C7C", fontSize: 13, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E6EEEE",
                    backgroundColor: "#FFFFFF",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#D7DF23"
                  strokeWidth={3}
                  fill="url(#targetGradient)"
                  dot={{ r: 3, fill: "#D7DF23" }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0A6670"
                  strokeWidth={4}
                  fill="url(#revenueGradient)"
                  dot={{ r: 3, fill: "#0A6670" }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
