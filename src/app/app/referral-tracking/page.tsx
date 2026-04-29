"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
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

type ReferralUser = {
  id: string;
  name: string;
  registeredAt: string;
  jobsPosted: number;
  revenue: string;
  avatar: string;
};

const rowsPerPage = 5;
const referralRevenueData = [
  { month: "Jan", viaCode: 120, viaLink: 80 },
  { month: "Feb", viaCode: 190, viaLink: 140 },
  { month: "Mar", viaCode: 240, viaLink: 170 },
  { month: "Apr", viaCode: 200, viaLink: 220 },
  { month: "May", viaCode: 320, viaLink: 260 },
  { month: "Jun", viaCode: 290, viaLink: 310 },
  { month: "July", viaCode: 410, viaLink: 350 },
  { month: "Aug", viaCode: 370, viaLink: 390 },
  { month: "Sep", viaCode: 340, viaLink: 360 },
  { month: "Oct", viaCode: 460, viaLink: 400 },
  { month: "Nov", viaCode: 430, viaLink: 440 },
  { month: "Dec", viaCode: 520, viaLink: 470 },
];

const referralUsers: ReferralUser[] = [
  { id: "01", name: "Jack Martian", registeredAt: "12/12/2025", jobsPosted: 56, revenue: "$23,456", avatar: "https://i.pravatar.cc/86?img=11" },
  { id: "02", name: "Amy Cooper", registeredAt: "14/12/2025", jobsPosted: 42, revenue: "$18,120", avatar: "https://i.pravatar.cc/86?img=32" },
  { id: "03", name: "Liam Noah", registeredAt: "16/12/2025", jobsPosted: 61, revenue: "$27,004", avatar: "https://i.pravatar.cc/86?img=25" },
  { id: "04", name: "Sophie Reed", registeredAt: "18/12/2025", jobsPosted: 33, revenue: "$14,760", avatar: "https://i.pravatar.cc/86?img=47" },
  { id: "05", name: "Daniel Blake", registeredAt: "20/12/2025", jobsPosted: 48, revenue: "$19,932", avatar: "https://i.pravatar.cc/86?img=59" },
  { id: "06", name: "Olivia Grace", registeredAt: "22/12/2025", jobsPosted: 52, revenue: "$22,508", avatar: "https://i.pravatar.cc/86?img=41" },
  { id: "07", name: "Henry Lucas", registeredAt: "25/12/2025", jobsPosted: 39, revenue: "$16,230", avatar: "https://i.pravatar.cc/86?img=6" },
];

function ReferralSummaryCard({
  label,
  value,
  actionLabel,
  isCopied,
  onCopy,
}: {
  label: string;
  value: string;
  actionLabel: string;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex min-h-[88px] items-center justify-between rounded-[24px] bg-white px-6 py-4 shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)]">
      <div>
        <p className="text-[14px] leading-[18px] text-black/80">{label}</p>
        <h3 className="mt-1 text-[20px] leading-[25px] font-semibold text-black">{value}</h3>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="flex h-[68px] w-[91px] items-center justify-center gap-2 rounded-[16px] bg-[#005864]/[0.06] text-[16px] leading-[20px] font-semibold text-[#005864]"
      >
        <Copy size={16} />
        {isCopied ? "Copied" : actionLabel}
      </button>
    </div>
  );
}

export default function ReferralTrackingPage() {
  const [copiedItem, setCopiedItem] = useState<"code" | "link" | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const referralCode = "NEXA-12345";
  const referralLink = "nexahome.com/signup?ref=NEXA-12345";

  const handleCopy = async (value: string, item: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem((current) => (current === item ? null : current)), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return referralUsers.filter((user) => {
      const searchMatch =
        normalizedSearch.length === 0 ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.registeredAt.toLowerCase().includes(normalizedSearch) ||
        user.revenue.toLowerCase().includes(normalizedSearch);

      if (!searchMatch) return false;
      if (!selectedDate) return true;

      const [day, month, year] = user.registeredAt.split("/");
      const isoDate = `${year}-${month}-${day}`;
      return isoDate === selectedDate;
    });
  }, [searchValue, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[50px] bg-[#EAFCFF] p-6">
     
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">Referral Tracking</h1>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[357px_1fr]">
        <ReferralSummaryCard
          label="Referral Code"
          value={referralCode}
          actionLabel="Copy"
          isCopied={copiedItem === "code"}
          onCopy={() => void handleCopy(referralCode, "code")}
        />
        <ReferralSummaryCard
          label="Referral Link"
          value={referralLink}
          actionLabel="Copy"
          isCopied={copiedItem === "link"}
          onCopy={() => void handleCopy(referralLink, "link")}
        />
      </section>

      <section className="mt-5 rounded-[24px] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] leading-[19px] font-bold text-black">Revenue Analysis</h2>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-full bg-[#F8F8F8] px-3 text-[13px] leading-4 font-medium text-[#005864]"
          >
            Monthly
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="mt-4 h-[390px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={referralRevenueData}
              margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="referralCodeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005864" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#005864" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="referralLinkFill" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="viaCode"
                name="Users Via Referral Code"
                stroke="#005864"
                strokeWidth={3}
                fill="url(#referralCodeFill)"
                dot={{ r: 3, fill: "#005864" }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="viaLink"
                name="User Via Referral Link"
                stroke="#D7DF23"
                strokeWidth={3}
                fill="url(#referralLinkFill)"
                dot={{ r: 3, fill: "#D7DF23" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[24px] leading-[30px] font-semibold text-black">Referral Activity</h2>

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
                onClick={() => {
                  setSelectedDate("");
                  setCurrentPage(1);
                }}
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

          <div className="px-8 py-4">
            {paginatedUsers.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center py-3 text-[16px] leading-5 text-black ${
                  index !== paginatedUsers.length - 1 ? "border-b border-[#EEEEEE]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="h-[43px] w-[43px] rounded-full object-cover" />
                  <span>{user.name}</span>
                </div>
                <span>{user.registeredAt}</span>
                <span>{user.jobsPosted}</span>
                <span>{user.revenue}</span>
              </div>
            ))}
            {paginatedUsers.length === 0 ? (
              <p className="py-10 text-center text-[15px] text-black/60">No referrals found for current filters.</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={safePage === 1}
            className="h-12 w-12 rounded-full bg-[#005864]/[0.06] text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mx-auto" size={20} />
          </button>
          <div className="rounded-full bg-[#F9FAFA] px-8 py-3 text-[16px] leading-5 font-medium text-black">
            {String(safePage).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={safePage === totalPages}
            className="h-12 w-12 rounded-full bg-[#005864] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="mx-auto" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

