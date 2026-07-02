"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingUp as TrendingIcon,
  ChevronDown,
  Loader2,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { connectBankAccount, getBankAccountStatus } from "@/lib/api/dashboard.api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchDashboardSummary, fetchRevenueAnalysis, fetchGrowthTracking } from "@/lib/slices/dashboardSlice";




export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stats,
    loading,
    error,
    revenueAnalysis,
    chartsLoading,
    chartsError,
    growthTracking,
    growthTrackingLoading,
    growthTrackingError,
  } = useSelector((state: RootState) => state.dashboard);
  const [revenueGroupBy, setRevenueGroupBy] = useState<"month" | "year">("month");
  const [growthGroupBy, setGrowthGroupBy] = useState<"month" | "year">("month");
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  const [bankStatus, setBankStatus] = useState<string | null>(null);
  const [isLoadingBankStatus, setIsLoadingBankStatus] = useState(true);

  useEffect(() => {
    const fetchBankStatus = async () => {
      try {
        const res = await getBankAccountStatus();
        console.log(res.data, "getBankAccountStatus");
        setBankStatus(res.data.stripeConnect.stripeAccountStatus);
      } catch (err) {
        setBankStatus(null);
      } finally {
        setIsLoadingBankStatus(false);
      }
    };
    fetchBankStatus();
  }, []);

  const handleConnectBank = async () => {
    try {
      setIsConnectingBank(true);
      const res = await connectBankAccount(`${window.location.origin}/app/dashboard`);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.success(res.message || "Connected successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to connect bank account");
    } finally {
      setIsConnectingBank(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRevenueAnalysis({ groupBy: revenueGroupBy, months: revenueGroupBy === "month" ? 12 : 5 }));
  }, [dispatch, revenueGroupBy]);

  useEffect(() => {
    dispatch(fetchGrowthTracking({ groupBy: growthGroupBy, months: growthGroupBy === "month" ? 12 : 5 }));
  }, [dispatch, growthGroupBy]);

  console.log(growthTrackingError, "growthTrackingError");


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

  const growthChartData = growthTracking?.series?.map((item: any) => ({
    month: formatPeriod(item.period, growthGroupBy),
    "Referral Signups": item.signups,
    "Jobs Via Referral": item.jobsPosted,
  }));


  const dashboardStats = [
    {
      title: "Total Users",
      value: stats?.usersAdded?.value?.toLocaleString() || "0",
      icon: Users,
      increase: stats?.usersAdded?.increasePercentThisMonth || 0,
    },
    {
      title: "Total Jobs Posted",
      value: stats?.jobsPosted?.value?.toLocaleString() || "0",
      icon: Briefcase,
      increase: stats?.jobsPosted?.increasePercentThisMonth || 0,
    },
    {
      title: "Total Revenue",
      value: "$" + (stats?.revenueGenerated?.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0"),
      icon: TrendingUp,
      increase: stats?.revenueGenerated?.increasePercentThisMonth || 0,
    },
  ];

  return (
    <div className="min-h-screen">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A]">
          Dashboard
        </h1>
        {isLoadingBankStatus ? (
          <div className="h-12 flex items-center justify-center px-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#005864]" />
          </div>
        ) : bankStatus === "approved" ? (
          <div className="h-12 flex items-center rounded-2xl bg-[rgba(0,88,100,0.06)] px-5 text-[16px] font-[700] text-[#005864] capitalize">
            <Landmark className="w-5 h-5 mr-2" />
            Status: {bankStatus}
          </div>
        ) : (
          <Button
            onClick={handleConnectBank}
            disabled={isConnectingBank}
            className="h-12 rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852]"
          >
            {isConnectingBank ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Landmark className="w-5 h-5 mr-2" />}
            Connect Bank Account
          </Button>
        )}
      </div>

      {/* Top Metrics Row */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#005864]" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10 bg-red-50 rounded-2xl mb-6">
          {error}
        </div>
      ) : !stats || Object.keys(stats).length === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-black/40">
          No data available.
        </div>
      ) : (
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
      )}

      <h1 className="text-[24px] leading-[45px] font-[500] text-[#1A1A1A]">
        Referral Performance
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-2">
        {/* Revenue Analysis Chart */}
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
                No Revenue Data Available.
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
                    tickFormatter={(value) => Number(value || 0).toFixed(2)}
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

        {/* Growth Tracking */}
        <Card className="xl:col-span-2 rounded-[28px] border-none shadow-sm bg-white p-6 min-h-[430px] flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[18px] font-[700] text-[#1A1A1A]">
              Growth Tracking
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer outline-none select-none hover:bg-[#ebf3f3] transition-colors border-none">
                {growthGroupBy === "month" ? "Monthly" : "Yearly"} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-[#E6EEEE] rounded-xl shadow-lg p-1 min-w-[100px] z-50">
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864]"
                  onClick={() => setGrowthGroupBy("month")}
                >
                  Monthly
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg text-xs font-semibold text-gray-700 hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864]"
                  onClick={() => setGrowthGroupBy("year")}
                >
                  Yearly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-[400] text-gray-500">
              <div className="w-3 h-3 bg-[#005864] rounded-sm" /> Referral Signups
            </div>
            <div className="flex items-center gap-2 text-xs font-[400] text-gray-500">
              <div className="w-3 h-3 bg-[#C8E015] rounded-sm" /> Jobs Posted via Referred Users
            </div>
          </div>
          <div className="h-[300px]">
            {growthTrackingLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005864]" />
              </div>
            ) : growthTrackingError ? (
              <div className="flex h-full items-center justify-center text-red-500">
                {growthTrackingError}

              </div>
            ) : !growthChartData || growthChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-black/40">
                No Growth Data Available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthChartData}
                  margin={{ top: 8, right: 4, left: 0, bottom: 6 }}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="4 5" stroke="#ECEFF1" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E8ECEF",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                  <Legend wrapperStyle={{ display: "none" }} />
                  <Bar
                    dataKey="Referral Signups"
                    fill="#005864"
                    radius={[12, 12, 12, 12]}
                    maxBarSize={16}
                  />
                  <Bar
                    dataKey="Jobs Via Referral"
                    fill="#C8E015"
                    radius={[12, 12, 12, 12]}
                    maxBarSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
