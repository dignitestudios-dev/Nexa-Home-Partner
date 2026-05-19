"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getMe, logout } from "@/lib/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("authToken");

        const isAuthPage = pathname.startsWith("/auth");

        const isAppPage = pathname.startsWith("/app");

        /* =========================================
           NO TOKEN
        ========================================= */
        if (!token) {
          if (isAppPage) {
            router.replace("/auth/login");
          }

          setCheckingAuth(false);

          return;
        }

        /* =========================================
           GET USER
        ========================================= */

        const result = await dispatch(getMe());

        /* =========================================
           API FAILED
        ========================================= */

        if (getMe.rejected.match(result)) {
          dispatch(logout());

          router.replace("/auth/login");

          setCheckingAuth(false);

          return;
        }

        const user = result.payload?.data;

        /* =========================================
           NO USER
        ========================================= */

        if (!user) {
          dispatch(logout());

          router.replace("/auth/login");

          setCheckingAuth(false);

          return;
        }

        /* =========================================
           EMAIL NOT VERIFIED
        ========================================= */

        if (!user.isEmailVerified) {
          router.replace(
            `/auth/signup-verify-otp?email=${encodeURIComponent(
              user.email
            )}`
          );

          setCheckingAuth(false);

          return;
        }

        /* =========================================
           PROFILE NOT COMPLETE
        ========================================= */

        if (!user.isProfileCompleted) {
          if (pathname !== "/auth/register") {
            router.replace("/auth/register");
          }

          setCheckingAuth(false);

          return;
        }

        /* =========================================
           PROFILE COMPLETE
        ========================================= */

        if (isAuthPage) {
          router.replace("/app/dashboard");
        }

        setCheckingAuth(false);
      } catch (error) {
        dispatch(logout());

        router.replace("/auth/login");

        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [pathname]);

  /* =========================================
     GLOBAL LOADER
  ========================================= */

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#005864]" />
      </div>
    );
  }

  return <>{children}</>;
}