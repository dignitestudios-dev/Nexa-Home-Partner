"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";

// Icons
import { MdTrendingUp } from "react-icons/md";
import { IoPeopleOutline, IoChevronDown } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const stats = [
  { title: "Total Revenue by Ads", value: "$ 56,879", icon: MdTrendingUp },
  { title: "Total Revenue by Leads", value: "$ 56,879", icon: IoPeopleOutline },
  { title: "Adv. Category Package", value: "$ 1,299", icon: RiMoneyDollarCircleLine },
];

const data = [
  { name: "Jan", ads: 0, leads: 50, pkg: 40 },
  { name: "Feb", ads: 420, leads: 380, pkg: 150 },
  { name: "Mar", ads: 380, leads: 530, pkg: 410 },
  { name: "Apr", ads: 200, leads: 400, pkg: 520 },
  { name: "May", ads: 180, leads: 320, pkg: 240 },
  { name: "Jun", ads: 220, leads: 380, pkg: 300 },
  { name: "July", ads: 60, leads: 90, pkg: 140 },
  { name: "Aug", ads: 210, leads: 260, pkg: 120 },
  { name: "Sep", ads: 380, leads: 320, pkg: 280 },
  { name: "Oct", ads: 320, leads: 440, pkg: 400 },
  { name: "Nov", ads: 120, leads: 240, pkg: 320 },
  { name: "Dec", ads: 0, leads: 80, pkg: 10 },
];

export default function RevenueDashboard() {
  return (
    <div className="min-h-screen  font-sans bg-[#F0F9F9]">
      {/* Page Title */}
      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">Revenue and Monetization</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((item, i) => (
          <Card key={i} className="border-none shadow-none rounded-[24px] bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-[#00586417] p-3 rounded-2xl shadow-sm text-[#005864] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5">{item.title}</p>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{item.value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart Card */}
      <Card className="rounded-[32px] border-none shadow-sm bg-white p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Heading Should be here</h2>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0A6270] rounded-[3px]" />
                <span className="text-[11px] font-medium text-gray-500">Total Revenue by Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#E67E22] rounded-[3px]" />
                <span className="text-[11px] font-medium text-gray-500">Total Revenue by Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#D980FA] rounded-[3px]" />
                <span className="text-[11px] font-medium text-gray-500">Adv. Category Package</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#F4F9F9] px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-bold text-gray-600 border border-transparent hover:border-gray-200 transition-all">
              Monthly <IoChevronDown size={14} />
            </button>
           
          </div>
        </div>

        {/* Recharts Area */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A6270" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#0A6270" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F0F0F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}}
                domain={[0, 600]}
                ticks={[0, 100, 200, 300, 400, 500, 600]}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip cursor={{ stroke: '#EEE' }} />
              
              {/* Main Filled Area */}
              <Area 
                type="monotone" 
                dataKey="ads" 
                stroke="#0FA3A3" 
                fillOpacity={1} 
                fill="url(#colorAds)" 
                strokeWidth={0}
              />
              
              {/* Dashed Line 1 (Orange) */}
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#E67E22"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="8 5"
              />

              {/* Dashed Line 2 (Purple) */}
              <Area
                type="monotone"
                dataKey="pkg"
                stroke="#D980FA"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="8 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}