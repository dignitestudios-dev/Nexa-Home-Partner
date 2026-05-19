import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "NexaHome Partner | CRM & Business Intelligence Dashboard",
  description:
    "NexaHome Partner is a modern CRM platform to manage vendors, referrals, CSV imports, revenue insights, and business operations from one unified dashboard.",
  icons: {
    icon: "/asset/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <AuthProvider>
            {children}
         <Toaster
  position="bottom-right"
  richColors
  toastOptions={{
    classNames: {
      toast:
        "!bg-[#005F6B] !text-white !border-0 !rounded-2xl !shadow-lg !px-5 !py-4",
      error: "!bg-[#005F6B]",
      title: "!text-white !text-[18px] !font-semibold",
      description: "!text-white/90",
      closeButton: "!text-white",
    },
  }}
/>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
