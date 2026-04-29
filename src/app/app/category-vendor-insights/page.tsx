"use client";

import { useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

type InsightRow = {
  rank: string;
  name: string;
  totalJobsPosted: number;
};

type HomeownerInsightRow = {
  rank: string;
  homeownerName: string;
  category: string;
  totalJobsCompleted: number;
  avatar: string;
};

const topCategories: InsightRow[] = Array.from({ length: 13 }, () => ({
  rank: "01",
  name: "Window Cleaning",
  totalJobsPosted: 56,
}));

const topHomeowners: HomeownerInsightRow[] = [
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=11",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=12",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=13",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=14",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=15",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=16",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=17",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=18",
  },
  {
    rank: "01",
    homeownerName: "Jack Martian",
    category: "Window Cleaning",
    totalJobsCompleted: 56,
    avatar: "https://i.pravatar.cc/86?img=19",
  },
];

export default function CategoryVendorInsightsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "homeowners">(
    "categories"
  );

  const categoryRows = useMemo(
    () => (activeTab === "categories" ? topCategories : topHomeowners),
    [activeTab]
  );

  return (
    <div className={`${plusJakarta.className} relative min-h-screen overflow-hidden rounded-[50px] bg-[#EAFCFF] p-6`}>
      <div className="pointer-events-none absolute -bottom-52 right-[-120px] h-[560px] w-[569px] rounded-full bg-[linear-gradient(180deg,#D7DF23_0%,#005864_100%)] opacity-30 blur-[220px]" />

      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Category &amp; Homeowner
      </h1>

      <div className="mt-6 w-full max-w-[312px] rounded-[8px] bg-white p-1 shadow-[0px_4px_19.4px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-2 gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`h-[34px] rounded-[8px] px-4 text-[14px] leading-[18px] ${
              activeTab === "categories"
                ? "bg-[#005864] font-[600] text-white"
                : "bg-white font-[400] text-[#1C1C1C]"
            }`}
          >
            Top Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("homeowners")}
            className={`h-[34px] rounded-[8px] px-4 text-[14px] leading-[18px] ${
              activeTab === "homeowners"
                ? "bg-[#005864] font-[600] text-white"
                : "bg-white font-[400] text-[#1C1C1C]"
            }`}
          >
            Top Homeowners
          </button>
        </div>
      </div>

      <section className="mt-4 w-full max-w-[1106px] rounded-[24px] bg-white pb-5">
        {activeTab === "categories" ? (
          <>
            <div className="grid h-[57px] grid-cols-[80px_1fr_180px] items-center rounded-[39px] bg-[rgba(0,88,100,0.06)] px-8 text-[14px] leading-[18px] font-[500] text-black">
              <span>Rank</span>
              <span className="text-center">Category</span>
              <span>Total Jobs Posted</span>
            </div>

            <div className="px-8 pt-4">
              {(categoryRows as InsightRow[]).map((row, index) => (
                <div
                  key={`${row.rank}-${index}`}
                  className={`grid grid-cols-[80px_1fr_180px] items-center py-3 text-[16px] leading-[20px] font-[400] text-black ${
                    index !== categoryRows.length - 1
                      ? "border-b border-[rgba(238,238,238,0.93)]"
                      : ""
                  }`}
                >
                  <span>{row.rank}</span>
                  <span className="text-center">{row.name}</span>
                  <span>{row.totalJobsPosted}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid h-[57px] grid-cols-[100px_1.45fr_1fr_180px] items-center rounded-[39px] bg-[rgba(0,88,100,0.06)] px-6 text-[14px] leading-[18px] font-[500] text-black">
              <span>Rank</span>
              <span>Homeowner Name</span>
              <span>Category</span>
              <span>Total Jobs Completed</span>
            </div>

            <div className="px-6 pt-3">
              {topHomeowners.map((row, index) => (
                <div
                  key={`${row.rank}-${row.homeownerName}-${index}`}
                  className={`grid grid-cols-[100px_1.45fr_1fr_180px] items-center py-3 text-[16px] leading-[20px] font-[400] text-black ${
                    index !== topHomeowners.length - 1
                      ? "border-b border-[rgba(238,238,238,0.93)]"
                      : ""
                  }`}
                >
                  <span>{row.rank}</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={row.avatar}
                      alt={row.homeownerName}
                      className="h-[43px] w-[43px] rounded-full border border-[#5ABFCB] object-cover"
                    />
                    <span>{row.homeownerName}</span>
                  </div>
                  <span>{row.category}</span>
                  <span>{row.totalJobsCompleted}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
