import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReferralCode, getReferralActivity, getRevenueAnalysis } from "../api/referral-tracking.api";

interface ReferralActivity {
  id: string;
  name: string;
  registrationDate: string;
  jobsPosted: number;
  revenueGenerated: string;
  avatar: string;
}

interface RevenueAnalysisItem {
  month: string;   // "Jun 2026" — display ke liye
  revenue: number;
  signups: number;
  jobs: number;
}

interface ReferralTrackingState {
  referralCode: string | null;
  activity: ReferralActivity[];
  totalActivity: number;
  activityLoading: boolean;
  activityError: string | null;
  loading: boolean;
  error: string | null;
  revenueAnalysis: RevenueAnalysisItem[];
  chartsLoading: boolean;
  chartsError: string | null;
}

const initialState: ReferralTrackingState = {
  referralCode: null,
  activity: [],
  totalActivity: 0,
  activityLoading: false,
  activityError: null,
  loading: false,
  error: null,
  revenueAnalysis: [],
  chartsLoading: false,
  chartsError: null,
};

// "2026-06" → "Jun 2026"
function formatPeriod(period: string): string {
  if (!period) return "";
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const fetchReferralCode = createAsyncThunk(
  "referralTracking/fetchReferralCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getReferralCode();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referral code"
      );
    }
  }
);

export const fetchRevenueAnalysis = createAsyncThunk(
  "referralTracking/fetchRevenueAnalysis",
  async (
    { groupBy, months }: { groupBy?: string; months?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await getRevenueAnalysis(groupBy, months);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch revenue analysis"
      );
    }
  }
);

export const fetchReferralActivity = createAsyncThunk(
  "referralTracking/fetchReferralActivity",
  async (
    { page, limit, search }: { page: number; limit: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getReferralActivity(page, limit, search);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referral activity"
      );
    }
  }
);

const referralTrackingSlice = createSlice({
  name: "referralTracking",
  initialState,
  reducers: {
    clearReferralError: (state) => {
      state.error = null;
      state.activityError = null;
      state.chartsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Referral Code
      .addCase(fetchReferralCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralCode.fulfilled, (state, action) => {
        state.loading = false;
        state.referralCode = action.payload.referralCode || action.payload;
      })
      .addCase(fetchReferralCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Referral Activity
      .addCase(fetchReferralActivity.pending, (state) => {
        state.activityLoading = true;
        state.activityError = null;
      })
      .addCase(fetchReferralActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activity = action.payload.activity;
        state.totalActivity = action.payload.total || 0;
      })
      .addCase(fetchReferralActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.activityError = action.payload as string;
      })

      // Revenue Analysis
      .addCase(fetchRevenueAnalysis.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchRevenueAnalysis.fulfilled, (state, action) => {
        state.chartsLoading = false;
        // API: { groupBy, months, totalSignups, series: [{ period, revenue, signups, jobs }] }
        const series: any[] = action.payload?.series ?? [];
        state.revenueAnalysis = series.map((item) => ({
          month: formatPeriod(item.period),   // "2026-06" → "Jun 2026"
          revenue: item.revenue ?? 0,
          signups: item.signups ?? 0,
          jobs: item.jobs ?? 0,
        }));
      })
      .addCase(fetchRevenueAnalysis.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.payload as string;
      });
  },
});

export const { clearReferralError } = referralTrackingSlice.actions;
export default referralTrackingSlice.reducer;