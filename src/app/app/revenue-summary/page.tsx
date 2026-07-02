"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchDashboardSummary, fetchRevenueAnalysis } from "@/lib/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  TrendingUp,
  TrendingUp as TrendingIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
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
  const {
    stats,
    loading,
    error,
    revenueAnalysis,
    chartsLoading,
    chartsError,

  } = useSelector((state: RootState) => state.dashboard);
  const [revenueGroupBy, setRevenueGroupBy] = useState<"month" | "year">("month");
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchRevenueAnalysis({ groupBy: revenueGroupBy, months: revenueGroupBy === "month" ? 12 : 5 }));
  }, [dispatch, revenueGroupBy]);

  const formatPeriod = (period: string, groupBy: "month" | "year") => {
    if (!period) return "";
    try {
      if (groupBy === "month") {
        const parts = period.split("-");
        if (parts.length >= 2) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          return new Date(year, month, 1).toLocaleString("en-US", { month: "short" });
        }
        return period;
      } else {
        return period;
      }
    } catch (e) {
      return period;
    }
  };

  console.log(revenueAnalysis, "revenueAnalysis");
  const chartData = revenueAnalysis?.series?.map((item: any) => ({
    ...item,
    period: formatPeriod(item.period, revenueGroupBy),
  }));

  const dashboardStats = [

    {
      title: "Total Revenue",
      value: "$" + (stats?.revenueGenerated?.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0"),
      icon: TrendingUp,
      increase: stats?.revenueGenerated?.increasePercentThisMonth || 0,
    },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Revenue Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {dashboardStats.map((item, i) => (
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
                {item.increase}% increase this month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-2">
        <Card className="xl:col-span-3 rounded-[28px] border-none shadow-sm bg-white p-7 min-h-[430px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-[700] text-[#1A1A1A]">
              Revenue Analysis
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer outline-none select-none hover:bg-[#ebf3f3] transition-colors border-none">
                {revenueGroupBy === "month" ? "Monthly" : "Yearly"} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-[#E6EEEE] rounded-xl shadow-lg p-1 min-w-[100px] z-50">
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864]"
                  onClick={() => setRevenueGroupBy("month")}
                >
                  Monthly
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864]"
                  onClick={() => setRevenueGroupBy("year")}
                >
                  Yearly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="h-[320px]">
            {chartsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005864]" />
              </div>
            ) : chartsError ? (
              <div className="flex h-full items-center justify-center text-red-500">
                {chartsError}
              </div>
            ) : !chartData || chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-black/40">
                No Revenue Data Available!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData ?? []}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <defs>
                    <linearGradient
                      id="dashboardRevenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0FA3A3" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0FA3A3" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="5 6"
                    stroke="#E8ECEF"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(value) => `$${value}`}
                  />

                  <Tooltip
                    formatter={(value) => [`$${Number(value || 0).toFixed(2)}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E8ECEF",
                      backgroundColor: "#FFFFFF",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0FA3A3"
                    strokeWidth={3}
                    fill="url(#dashboardRevenueFill)"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
