"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePartnerStatus } from "@/hooks/usePartnerStatus";

export default function PartnerActiveGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isPartnerActive, loading } = usePartnerStatus();

  useEffect(() => {
    if (loading) return;

    // Allowed paths when profile is under review:
    const isAllowedUnderReview =
      pathname === "/app/dashboard" || pathname.startsWith("/app/edited-profile");

    if (!isPartnerActive && !isAllowedUnderReview) {
      router.replace("/app/dashboard");
    }
  }, [isPartnerActive, loading, pathname, router]);

  return <>{children}</>;
}
