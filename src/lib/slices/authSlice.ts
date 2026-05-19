// lib/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  login as loginAPI,
  forgotPassword as forgotPasswordAPI,
  verifyOTP as verifyOTPAPI,
  updatePassword as updatePasswordAPI,
  checkEmail as checkEmailAPI,
  verifyEmail as verifyEmailAPI,
  completeProfile as completeProfileAPI,
  getMeAPI,
  resendOtpAPI,
} from "../api/auth.api"; // tumhara API file
import Cookies from "js-cookie";

// ------------------ Types ------------------
export interface User {
  id: number;
  fullName?: string;
  email: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  profilePicture?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  email: string | null;
  isEmailVerified: boolean | null;
  tempPassword?: string;
}

// ------------------ Helper Functions ------------------
// Check if token exists and is valid
export const validateToken = (): boolean => {
  const token = Cookies.get("authToken");
  if (!token) {
    return false;
  }

  try {
    // Basic JWT token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      // Token expired, remove it
      Cookies.remove("authToken");
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token format, remove it
    Cookies.remove("authToken");
    return false;
  }
};

// ------------------ Initial State ------------------
const initialState: AuthState = {
  user: null,
  isAuthenticated: validateToken(),
  loading: false,
  success: false,
  error: null,
  email: null,
  isEmailVerified: null,
};

// ------------------ Async Thunks ------------------

// Check Email
export const checkEmail = createAsyncThunk<
  { exists: boolean; email: string },
  string
>("auth/checkEmail", async (email, thunkAPI) => {
  try {
    const data = await checkEmailAPI(email);
    return data.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Email check failed",
    );
  }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const data = await getMeAPI();
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "User fetch failed",
    );
  }
});
// Login user
export const loginUser = createAsyncThunk<
  any,
  { email: string; password: string }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    const data = await loginAPI(credentials); // API call
    return data; // Return full data to handle status in component
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed",
    );
  }
});

export const resendOtp = createAsyncThunk<any, string>(
  "auth/resendOtp",
  async (email, thunkAPI) => {
    try {
      const data = await resendOtpAPI(email);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to resend OTP",
      );
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk<
  any,
  { email: string; otp: string; role: string; mode: string }
>("auth/verifyEmail", async (payload, thunkAPI) => {
  try {
    const data = await verifyEmailAPI(payload);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to verify email",
    );
  }
});

// Complete Profile
export const completeProfile = createAsyncThunk<any, FormData>(
  "auth/completeProfile",
  async (formData, thunkAPI) => {
    try {
      const data = await completeProfileAPI(formData);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to complete profile",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (credentials, thunkAPI) => {
  try {
    const data = await forgotPasswordAPI(credentials.email);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Something went wrong",
    );
  }
});

export const verifyOTP = createAsyncThunk<void, { otp: any; email: string }>(
  "auth/verifyOTP",
  async (credentials, thunkAPI) => {
    try {
      await verifyOTPAPI(credentials.otp, credentials.email);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to verify OTP",
      );
    }
  },
);

export const updatePassword = createAsyncThunk<void, { password: string }>(
  "auth/updatePassword",
  async (credentials, thunkAPI) => {
    try {
      await updatePasswordAPI(credentials.password);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update password",
      );
    }
  },
);

// Token validation thunk
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, thunkAPI) => {
    const isValid = validateToken();
    if (!isValid) {
      return thunkAPI.rejectWithValue("Token expired or invalid");
    }
    return true;
  },
);

// ------------------ Slice ------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.success = false;
      state.error = null;
      state.tempPassword = undefined;
      Cookies.remove("authToken");
      Cookies.remove("resetToken");
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setTempPassword: (state, action: PayloadAction<string>) => {
      state.tempPassword = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(getMe.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Verify Email
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data?.user;
      state.isAuthenticated = !!action.payload.data?.token;
      if (action.payload.data?.user?.email) {
        state.email = action.payload.data.user.email;
      }
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Complete Profile
    builder.addCase(completeProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(completeProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload.data?.user || action.payload.data; // Adjusted based on common API patterns
    });
    builder.addCase(completeProfile.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload as string;
    });

    // Check Email
    builder.addCase(checkEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkEmail.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(checkEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Forgot password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // update password
    builder.addCase(updatePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updatePassword.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Check auth status
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(checkAuthStatus.fulfilled, (state) => {
      state.loading = false;
      // Token is valid, keep current state
    });

    builder.addCase(checkAuthStatus.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload as string;
      Cookies.remove("authToken");
    });
  },
});

// ------------------ Exports ------------------
export const { logout, setEmail, setTempPassword, clearError, resetSuccess } =
  authSlice.actions;
export default authSlice.reducer;
