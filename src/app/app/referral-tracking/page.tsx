"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
  Loader2,
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchReferralCode,
  fetchReferralActivity,
  fetchRevenueAnalysis,
} from "@/lib/slices/referral-trackingSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const rowsPerPage = 10;

type GroupBy = "month" | "year";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReferralSummaryCard({
  label,
  value,
  actionLabel,
  isCopied,
  onCopy,
  isLoading,
}: {
  label: string;
  value: string;
  actionLabel: string;
  isCopied: boolean;
  onCopy: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex min-h-[88px] items-center justify-between rounded-[24px] bg-white px-6 py-4 shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)]">
      <div>
        <p className="text-[14px] leading-[18px] text-black/80">{label}</p>
        {isLoading ? (
          <div className="mt-2 h-5 w-32 animate-pulse bg-black/10" />
        ) : (
          <h3 className="mt-1 text-[20px] leading-[25px] font-semibold text-black">{value}</h3>
        )}
      </div>
      <button
        type="button"
        onClick={onCopy}
        disabled={isLoading || !value}
        className="flex h-[68px] w-[91px] items-center justify-center gap-2 rounded-[16px] bg-[#005864]/[0.06] text-[16px] leading-[20px] font-semibold text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Copy size={16} />
        {isCopied ? "Copied" : actionLabel}
      </button>
    </div>
  );
}

export default function ReferralTrackingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    referralCode: apiReferralCode,
    loading,
    activity,
    activityLoading,
    totalActivity,
    activityError,
    revenueAnalysis,
    chartsLoading,
    chartsError,
  } = useSelector((state: RootState) => state.referralTracking);

  const [copiedItem, setCopiedItem] = useState<"code" | "link" | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [revenueGroupBy, setRevenueGroupBy] = useState<GroupBy>("month");

  useEffect(() => {
    dispatch(fetchReferralCode());
  }, [dispatch]);

  // groupBy change hone par naya API call
  useEffect(() => {
    dispatch(
      fetchRevenueAnalysis({
        groupBy: revenueGroupBy,
        months: revenueGroupBy === "month" ? 12 : undefined,
      })
    );
  }, [dispatch, revenueGroupBy]);

  useEffect(() => {
    dispatch(
      fetchReferralActivity({
        page: currentPage,
        limit: rowsPerPage,
        search: searchValue,
      })
    );
  }, [dispatch, currentPage, searchValue]);

  const referralCode = apiReferralCode || "";

  const handleCopy = async (value: string, item: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(item);
      setTimeout(
        () => setCopiedItem((current) => (current === item ? null : current)),
        1500
      );
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleGroupByChange = (value: GroupBy) => {
    if (value === revenueGroupBy) return;
    setRevenueGroupBy(value);
  };

  const totalPages = Math.max(1, Math.ceil(totalActivity / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[50px] bg-[#EAFCFF] p-6">
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Referral Tracking
      </h1>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[357px_1fr]">
        <ReferralSummaryCard
          label="Referral Code"
          value={referralCode}
          actionLabel="Copy"
          isCopied={copiedItem === "code"}
          onCopy={() => void handleCopy(referralCode, "code")}
          isLoading={loading}
        />
      </section>

      {/* ── Revenue Analysis Chart ── */}
      <section className="mt-5 rounded-[24px] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <h2 className="text-[16px] leading-[19px] font-bold text-black">
              Revenue Analysis
            </h2>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[13px] text-black/60">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#005864]" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-black/60">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D7DF23]" />
                Signup Users
              </span>
            </div>
          </div>

          {/* Monthly / Yearly Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer outline-none select-none hover:bg-[#ebf3f3] transition-colors border-none">
              {revenueGroupBy === "month" ? "Monthly" : "Yearly"}
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#E6EEEE] rounded-xl shadow-lg p-1 min-w-[100px] z-50"
            >
              <DropdownMenuItem
                className={`cursor-pointer rounded-lg text-xs font-semibold hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864] ${revenueGroupBy === "month" ? "text-[#005864]" : "text-gray-700"
                  }`}
                onClick={() => handleGroupByChange("month")}
              >
                Monthly
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`cursor-pointer rounded-lg text-xs font-semibold hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864] ${revenueGroupBy === "year" ? "text-[#005864]" : "text-gray-700"
                  }`}
                onClick={() => handleGroupByChange("year")}
              >
                Yearly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 h-[390px]">
          {chartsLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#005864]" />
            </div>
          ) : chartsError ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {chartsError}
            </div>
          ) : revenueAnalysis.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-black/40">
              No revenue data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueAnalysis}
                margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="referralRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005864" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#005864" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="referralSignupFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D7DF23" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#D7DF23" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 6" stroke="#E6E6E6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(24,24,24,0.6)", fontSize: 13 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(24,24,24,0.6)", fontSize: 13 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E6EEEE",
                    backgroundColor: "#FFFFFF",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") return [`$${Number(value || 0).toFixed(2)}`, "Revenue"];
                    if (name === "signups") return [value, "Signup Users"];
                    return [value, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#005864"
                  strokeWidth={3}
                  fill="url(#referralRevenueFill)"
                  dot={{ r: 3, fill: "#005864" }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  name="signups"
                  stroke="#D7DF23"
                  strokeWidth={3}
                  fill="url(#referralSignupFill)"
                  dot={{ r: 3, fill: "#D7DF23" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── Referral Activity Table ── */}
      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[24px] leading-[30px] font-semibold text-black">
            Referral Activity
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-[322px] items-center justify-between rounded-[22px] bg-white px-4 shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)]">
              <input
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search here"
                className="w-full bg-transparent text-[14px] leading-[18px] text-black/80 placeholder:text-black/60 focus:outline-none"
              />
              <Search size={20} className="text-black/80" />
            </div>
            <label className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#005864] text-white shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)]">
              <Calendar size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            {selectedDate ? (
              <button
                type="button"
                onClick={() => { setSelectedDate(""); setCurrentPage(1); }}
                className="h-11 rounded-[10px] bg-[#005864]/10 px-3 text-[12px] font-medium text-[#005864]"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] bg-white">
          <div className="grid h-[57px] grid-cols-[1.5fr_1fr_1fr_1fr] items-center rounded-[24px] bg-[#005864]/[0.06] px-8 text-[14px] leading-[18px] font-medium text-black">
            <span>User Name</span>
            <span>Registration Date</span>
            <span>Jobs Posted</span>
            <span>Revenue Generated</span>
          </div>

          <div className="px-8 py-4 relative min-h-[200px]">
            {activityLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#005864]" />
              </div>
            )}
            {activity.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-[16px] leading-5 text-black ${index !== activity.length - 1 ? "border-b border-[#EEEEEE]" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  {/* <img
                    src={user.avatar || "https://i.pravatar.cc/86?img=1"}
                    alt={user.name}
                    className="h-[43px] w-[43px] rounded-full object-cover"
                  /> */}
                  <span>{user.userName}</span>
                </div>
                <span>{formatDate(user.registrationDate)}</span>
                <span>{user.jobsPosted}</span>
                <span>${Number(user.revenueGenerated || 0).toFixed(2)}</span>
              </div>
            ))}
            {!activityLoading && activity.length === 0 ? (
              <p className="py-10 text-center text-[15px] text-black/60">
                {activityError || "No referrals found for current filters."}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => { if (currentPage > 1) setCurrentPage((p) => p - 1); }}
            disabled={safePage === 1 || activityLoading}
            className="h-12 w-12 rounded-full bg-[#005864]/[0.06] text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mx-auto" size={20} />
          </button>
          <div className="rounded-full bg-[#F9FAFA] px-8 py-3 text-[16px] leading-5 font-medium text-black">
            {String(safePage).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); }}
            disabled={safePage === totalPages || activityLoading}
            className="h-12 w-12 rounded-full bg-[#005864] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="mx-auto" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}