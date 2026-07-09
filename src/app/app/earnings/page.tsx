"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, ChevronDown, DollarSign, TrendingUp as TrendingIcon, Wallet, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchEarnings, clearEarningsError } from "@/lib/slices/earningsSlice";

const rowsPerPage = 10;

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend?: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="p-5 flex items-center gap-4">
          <div className="bg-[#E6EEEE] p-4 rounded-[14px]">
            <Icon className="w-7 h-7 text-[#004D4D]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-500 mb-1">
              {label}
            </p>
            <h2 className="text-[24px] leading-none font-[600] text-[#1A1A1A] tracking-tight">
              {value}
            </h2>
          </div>
        </div>
        {trend && (
          <div className="bg-[#005864] py-3 px-5 flex items-center gap-2 text-white font-medium text-sm">
            <TrendingIcon className="w-4 h-4" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function EarningsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { earnings, totalEarnings, totalJobSpend, pagination, loading, error } = useSelector((state: RootState) => state.earnings);
  console.log(pagination, 'pagination')
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    dispatch(fetchEarnings({
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch,
      status: selectedStatus
    }));
  }, [dispatch, currentPage, debouncedSearch, selectedStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEarningsError());
    }
  }, [error, dispatch]);

  const displayData = earnings || [];
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[50px] bg-[#EAFCFF] p-6">
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Earnings
      </h1>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Earnings"
          value={`$${Number(totalEarnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="Live referral earnings"
          icon={DollarSign}
        />
        <StatCard
          label="Total Job Spend"
          value={`$${Number(totalJobSpend).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="Total partner volume"
          icon={Wallet}
        />
      </section>

      {/* ── Earnings Table ── */}
      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[24px] leading-[30px] font-semibold text-black">
            Earnings History
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-[322px] items-center justify-between rounded-[22px] bg-white px-4 shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)]">
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search earnings"
                className="w-full bg-transparent text-[14px] leading-[18px] text-black/80 placeholder:text-black/60 focus:outline-none"
              />
              <Search size={20} className="text-black/80" />
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger className="bg-white shadow-[0px_4px_45px_6px_rgba(0,88,100,0.08)] px-4 py-3 rounded-[10px] flex items-center justify-between gap-2 text-[14px] leading-[18px] text-black/80 cursor-pointer outline-none select-none transition-colors border-none min-w-[150px] h-11">
                {selectedStatus ? selectedStatus : "All Statuses"}
                <ChevronDown className="w-4 h-4 text-black/80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-[#E6EEEE] rounded-xl shadow-lg p-1 min-w-[150px] z-50"
              >
                <DropdownMenuItem
                  className={`cursor-pointer rounded-lg text-[13px] font-semibold hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864] ${selectedStatus === "" ? "text-[#005864]" : "text-gray-700"
                    }`}
                  onClick={() => { setSelectedStatus(""); setCurrentPage(1); }}
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer rounded-lg text-[13px] font-semibold hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864] ${selectedStatus === "Completed" ? "text-[#005864]" : "text-gray-700"
                    }`}
                  onClick={() => { setSelectedStatus("active"); setCurrentPage(1); }}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer rounded-lg text-[13px] font-semibold hover:bg-[#F4F9F9] hover:text-[#005864] focus:bg-[#F4F9F9] focus:text-[#005864] ${selectedStatus === "Pending" ? "text-[#005864]" : "text-gray-700"
                    }`}
                  onClick={() => { setSelectedStatus("pending"); setCurrentPage(1); }}
                >
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>

        <div className="rounded-[24px] bg-white relative overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr] items-center bg-[#005864]/[0.06] px-8 py-4 text-[14px] leading-[18px] font-medium text-black">
            <span>User</span>
            <span>Date & Time</span>
            <span>Job Title</span>
            <span>Commission Amount</span>
            <span>Transfer Status</span>
          </div>

          {/* Table Content */}
          <div className="px-8 py-2 relative min-h-[250px] flex flex-col justify-start">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-[1px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#005864]" />
              </div>
            )}

            {displayData.map((item, index) => (
              <div
                key={item.commissionId || index}
                className={`grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr] items-center py-4 text-[15px] text-black ${index !== displayData.length - 1 ? "border-b border-[#EEEEEE]" : ""
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.referredUser?.profilePicture?.location || "https://i.pravatar.cc/150"}
                    alt={item.referredUser?.userName || "User Avatar"}
                    className="h-10 w-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-black/95 text-sm truncate">{item.referredUser?.userName || "N/A"}</span>
                    <span className="text-xs text-black/40 truncate">{item.referredUser?.email || "No email"}</span>
                  </div>
                </div>

                <span className="text-sm text-black/70">{formatDate(item.date)}</span>

                <span className="font-medium text-black/80 text-sm truncate pr-4" title={item.job?.title}>
                  {item.job?.title || "N/A"}
                </span>

                <span className="font-semibold text-[#005864] text-sm">
                  ${Number(item.commissionAmount || 0).toFixed(2)}
                </span>

                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium tracking-wide ${item.transferStatus?.toLowerCase() === "completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                    }`}>
                    {item.transferStatus}
                  </span>
                </div>
              </div>
            ))}

            {!loading && displayData.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center py-14 text-[15px] text-black/60 w-full">
                {error ? <span className="text-destructive font-medium">{error}</span> : "No earnings records found."}
              </div>
            ) : null}
          </div>
        </div>

        {/* Pagination controls footer */}
        <div className="mt-6 flex items-center justify-end gap-4">


          <button
            type="button"
            onClick={() => { if (currentPage > 1) setCurrentPage((p) => p - 1); }}
            disabled={currentPage === 1 || loading}
            className="h-12 w-12 rounded-full bg-[#005864]/[0.06] text-[#005864] hover:bg-[#005864]/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="mx-auto" size={20} />
          </button>

          <div className="rounded-full bg-white border border-gray-100 px-6 py-3 text-[15px] font-medium text-black shadow-sm">
            {String(currentPage).padStart(2, "0")}
          </div>

          <button
            type="button"
            onClick={() => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); }}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className="h-12 w-12 rounded-full bg-[#005864] text-white hover:bg-[#004d4d] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="mx-auto" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}