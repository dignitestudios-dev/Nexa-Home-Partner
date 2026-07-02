"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial state
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white p-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <WifiOff className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#1A1A1A]">No Internet Connection</h1>
        <p className="mt-4 max-w-[400px] text-center text-lg text-gray-600">
          Oops! It seems you're offline. Please check your network connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full bg-[#005864] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#004852]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
