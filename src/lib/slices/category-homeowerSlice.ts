

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategory, getHomeowner } from "../api/category-homeower.api";




// ======================
// Category Interfaces
// ======================

export interface Category {
  jobCount: number;
  categoryId: string;
  categoryName: string;
}

export interface CategoryResponse {
  categories: Category[];
}

// ======================
// Homeowner Interfaces
// ======================

export interface Homeowner {
  userId: string;
  userName: string;
  registrationDate: string;
  jobsPosted: number;
  revenueGenerated: number;
}

export interface HomeownerResponse {
  users: Homeowner[];
}

// ======================
// Slice State Interface
// ======================

export interface CategoryHomeownerState {
  category: CategoryResponse | null;
  homeowner: HomeownerResponse | null;
  loading: boolean;
  error: string | null;
}

// ======================
// Initial State
// ======================

const initialState: CategoryHomeownerState = {
  category: null,
  homeowner: null,
  loading: false,
  error: null,
};



export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await getCategory(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

export const fetchHomeowner = createAsyncThunk(
  "category/fetchHomeowner",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await getHomeowner(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch homeowner"
      );
    }
  }
);


const categoryHomeowerSlice = createSlice({
  name: "categoryHomeower",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHomeowner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeowner.fulfilled, (state, action) => {
        state.loading = false;
        state.homeowner = action.payload;
      })
      .addCase(fetchHomeowner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoryHomeowerSlice.reducer;

