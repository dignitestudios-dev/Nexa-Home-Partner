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
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
