import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEarnings } from "../api/earnings.api";

export interface EarningItem {
  _id?: string;
  commissionId: string;
  referredUser?: {
    _id: string;
    userName: string;
    email: string;
    profilePicture?: {
      location: string;
    };
  };
  date: string;
  job: {
    _id: string;
    title: string;
  };
  commissionAmount: number | string;
  transferStatus: string;
}

interface EarningsState {
  earnings: EarningItem[];
  totalEarnings: number;
  totalJobSpend: number;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: EarningsState = {
  earnings: [],
  totalEarnings: 0,
  totalJobSpend: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

export const fetchEarnings = createAsyncThunk(
  "earnings/fetchEarnings",
  async (
    { page, limit, search, status }: { page: number; limit: number; search: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getEarnings(page, limit, search, status);
      return response; // Yeh poora object return karega jo aapne bheja ha
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch earnings"
      );
    }
  }
);

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    clearEarningsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;

        // API response direct payload par ha
        const payload = action.payload?.data;

        state.earnings = payload?.earnings || [];
        state.pagination = {
          page: payload?.pagination?.currentPage,
          limit: payload?.pagination?.itemsPerPage,
          totalItems: payload?.pagination?.totalItems || 0,
          totalPages: payload?.pagination?.totalPages || 1,
        };

        // Summary data mapping
        state.totalEarnings = payload?.summary?.totalEarnings || 0;
        state.totalJobSpend = payload?.summary?.totalJobSpend || 0;
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEarningsError } = earningsSlice.actions;
export default earningsSlice.reducer;