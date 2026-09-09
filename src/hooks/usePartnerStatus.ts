"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { getMe } from "@/lib/slices/authSlice";

export function usePartnerStatus() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // In Redux, getMe returns the full response { success, data } or data
  const userData = user?.data || user;

  // Key 1: isPartnerActive
  // Defaults to false if not explicitly true
  const isPartnerActive = Boolean(userData?.isPartnerActive);

  // Key 2: stripeAccountStatus
  // Expected to be "approved" when fully onboarded
  const stripeAccountStatus = String(
    userData?.stripeAccountStatus || "not-provided"
  ).toLowerCase();
  const isStripeApproved = stripeAccountStatus === "approved";

  const refreshStatus = useCallback(async () => {
    return await dispatch(getMe());
  }, [dispatch]);

  return {
    user: userData,
    isPartnerActive,
    stripeAccountStatus,
    isStripeApproved,
    loading,
    refreshStatus,
  };
}
