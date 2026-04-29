"use client";

import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingUp as TrendingIcon,
  ChevronDown,
} from "lucide-react";
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

const stats = [
  { title: "Total Users", value: "56,879", icon: Users },
  { title: "Total Jobs Posted", value: "56,879", icon: Briefcase },
  { title: "Total Revenue", value: "56,879", icon: TrendingUp },
];

const revenueAnalysisData = [
  { month: "Jan", revenue: 160 },
  { month: "Feb", revenue: 240 },
  { month: "Mar", revenue: 190 },
  { month: "Apr", revenue: 280 },
  { month: "May", revenue: 360 },
  { month: "Jun", revenue: 300 },
  { month: "July", revenue: 420 },
  { month: "Aug", revenue: 390 },
  { month: "Sep", revenue: 340 },
  { month: "Oct", revenue: 470 },
  { month: "Nov", revenue: 510 },
  { month: "Dec", revenue: 560 },
];

const growthTrackingData = [
  { month: "Jan", referralSignups: 160, jobsViaReferral: 110 },
  { month: "Feb", referralSignups: 260, jobsViaReferral: 170 },
  { month: "Mar", referralSignups: 190, jobsViaReferral: 140 },
  { month: "Apr", referralSignups: 330, jobsViaReferral: 220 },
  { month: "May", referralSignups: 280, jobsViaReferral: 210 },
  { month: "Jun", referralSignups: 360, jobsViaReferral: 260 },
];

export default function DashboardPage() {
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(
    null
  );
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [savedSignaturePreview, setSavedSignaturePreview] = useState<string | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const openUploadModal = () => {
    setIsAgreementModalOpen(false);
    setIsUploadModalOpen(true);
  };

  const openSignatureModal = () => {
    setIsAgreementModalOpen(false);
    setIsSignatureModalOpen(true);
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
      setUploadedImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!uploadedImagePreview) {
      return;
    }
    setIsUploadModalOpen(false);
    setIsAgreementModalOpen(false);
  };

  const getCanvasPoint = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const { x, y } = getCanvasPoint(event);
    isDrawingRef.current = true;
    context.beginPath();
    context.moveTo(x, y);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.5;
    context.strokeStyle = "#1A1A1A";
  };

  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) {
      return;
    }
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const { x, y } = getCanvasPoint(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSavedSignaturePreview(null);
  };

  const handleSaveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return;
    }

    const signatureImage = canvas.toDataURL("image/png");
    setSavedSignaturePreview(signatureImage);
    setIsSignatureModalOpen(false);
    setIsAgreementModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Dialog open={isAgreementModalOpen} onOpenChange={setIsAgreementModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-[900px] rounded-[24px] bg-white p-10"
        >
          <DialogTitle className="text-[24px] font-[700] leading-[30px] text-black">
            Agreement
          </DialogTitle>

          <DialogDescription className="mt-3 h-[448px] overflow-y-auto pr-2 text-[16px] font-[400] leading-[32px] text-[rgba(24,24,24,0.8)]">
            Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet
            enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus
            risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Quis amet
            imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
            vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur. Diam
            aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet
            imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
            vulputate aliquet eu. Quis amet imperdiet ut molestie luctus risus
            lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum
            dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus
            vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia.
            Mauris vel mus at urna vulputate aliquet eu. Quis amet imperdiet ut
            molestie luctus risus lacinia. Mauris vel mus at urna vulputate
            aliquet eu. Lorem ipsum dolor sit amet consectetur.
          </DialogDescription>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              onClick={openUploadModal}
              className="h-12 rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] capitalize hover:bg-[rgba(0,88,100,0.12)]"
            >
              Upload Image
            </Button>
            <Button
              type="button"
              onClick={openSignatureModal}
              className="h-12 rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852]"
            >
              Draw Signature
            </Button>
          </div>

          {(uploadedImagePreview || savedSignaturePreview) && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {uploadedImagePreview ? (
                <div className="rounded-2xl border border-[#E6EEEE] p-3">
                  <p className="mb-2 text-xs font-[600] text-[#005864]">
                    Uploaded Image: {uploadedImageName}
                  </p>
                  <img
                    src={uploadedImagePreview}
                    alt="Uploaded preview"
                    className="h-28 w-full rounded-xl object-cover"
                  />
                </div>
              ) : null}
              {savedSignaturePreview ? (
                <div className="rounded-2xl border border-[#E6EEEE] p-3">
                  <p className="mb-2 text-xs font-[600] text-[#005864]">
                    Saved Signature
                  </p>
                  <img
                    src={savedSignaturePreview}
                    alt="Saved signature preview"
                    className="h-28 w-full rounded-xl object-contain"
                  />
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent
          className="w-full max-w-[620px] rounded-[24px] bg-white p-8"
        >
          <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
            Upload Image
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
            Select an image file, preview it, then click save.
          </DialogDescription>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelection}
          />

          <div className="mt-4 space-y-4">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
            >
              Choose Image
            </Button>

            <div className="h-[250px] rounded-2xl border border-dashed border-[#CFE0E0] bg-[#F9FCFC] p-3">
              {uploadedImagePreview ? (
                <img
                  src={uploadedImagePreview}
                  alt="Selected upload preview"
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No image selected yet
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSaveImage}
              disabled={!uploadedImagePreview}
              className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
        <DialogContent
          className="w-full max-w-[700px] rounded-[24px] bg-white p-8"
        >
          <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
            Draw Signature
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
            Draw your signature in the box below and save it.
          </DialogDescription>

          <div className="mt-4 rounded-2xl border border-[#E1EBEB] bg-[#FAFDFD] p-3">
            <canvas
              ref={signatureCanvasRef}
              width={620}
              height={280}
              className="h-[280px] w-full cursor-crosshair rounded-xl border border-dashed border-[#CFE0E0] bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={clearSignatureCanvas}
              className="h-12 rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleSaveSignature}
              className="h-12 rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852]"
            >
              Save Signature
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
        Dashboard
      </h1>

      {/* Top Metrics Row */}
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
            <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
              Monthly <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueAnalysisData}
                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0FA3A3" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0FA3A3" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 6" stroke="#E8ECEF" vertical={false} />
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value ?? 0}`, "Revenue"]}
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
                  dot={{ r: 2.5, fill: "#0FA3A3" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Growth Tracking */}
        <Card className="xl:col-span-2 rounded-[28px] border-none shadow-sm bg-white p-6 min-h-[430px] flex flex-col">
          <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-[700] text-[#1A1A1A]">
              Growth Tracking
            </h2>
            <div className="bg-[#F4F9F9] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
              Monthly <ChevronDown className="w-4 h-4" />
            </div>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthTrackingData}
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
                  dataKey="referralSignups"
                  fill="#005864"
                  radius={[12, 12, 12, 12]}
                  maxBarSize={16}
                />
                <Bar
                  dataKey="jobsViaReferral"
                  fill="#C8E015"
                  radius={[12, 12, 12, 12]}
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
