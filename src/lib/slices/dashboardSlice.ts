import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardSummary, getRevenueAnalysis, getGrowthTracking } from "../api/dashboard.api";

export interface DashboardStats {
  jobsPosted: number;
  usersAdded: number;
  revenueGenerated: number;
  revenueIncreaseThisMonth: number;
}

export interface RevenueAnalysisItem {
  month: string;
  revenue: number;
  referralSignups?: number;
  jobsViaReferral?: number;
}

export interface GrowthTrackingSeriesItem {
  period: string;
  signups: number;
  jobsPosted: number;
}

export interface GrowthTrackingData {
  groupBy: string;
  months: number;
  series: GrowthTrackingSeriesItem[];
}

interface DashboardState {
  stats: DashboardStats | null;
  revenueAnalysis: any;
  growthTracking: GrowthTrackingData | null;
  loading: boolean;
  chartsLoading: boolean;
  growthTrackingLoading: boolean;
  error: string | null;
  chartsError: string | null;
  growthTrackingError: string | null;
}

const initialState: DashboardState = {
  stats: null,
  revenueAnalysis: [],
  growthTracking: null,
  loading: false,
  chartsLoading: false,
  growthTrackingLoading: false,
  error: null,
  chartsError: null,
  growthTrackingError: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummary();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard summary"
      );
    }
  }
);

export const fetchRevenueAnalysis = createAsyncThunk(
  "dashboard/fetchRevenueAnalysis",
  async ({ groupBy, months }: { groupBy?: string; months?: number } = {}, { rejectWithValue }) => {
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

export const fetchGrowthTracking = createAsyncThunk(
  "dashboard/fetchGrowthTracking",
  async ({ groupBy, months }: { groupBy?: string; months?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await getGrowthTracking(groupBy, months);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch growth tracking"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
      state.chartsError = null;
      state.growthTrackingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revenue Analysis
      .addCase(fetchRevenueAnalysis.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchRevenueAnalysis.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.revenueAnalysis = action.payload;
      })
      .addCase(fetchRevenueAnalysis.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.payload as string;
      })
      // Growth Tracking
      .addCase(fetchGrowthTracking.pending, (state) => {
        state.growthTrackingLoading = true;
        state.growthTrackingError = null;
      })
      .addCase(fetchGrowthTracking.fulfilled, (state, action) => {
        state.growthTrackingLoading = false;
        state.growthTracking = action.payload;
      })
      .addCase(fetchGrowthTracking.rejected, (state, action) => {
        state.growthTrackingLoading = false;
        state.growthTrackingError = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
