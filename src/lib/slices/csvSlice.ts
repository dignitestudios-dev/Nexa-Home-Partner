import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { csvTemplate, getInvitations, uploadCsvFile } from "../api/csv.api";

export interface Invitation {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    phone?: string;
    status: string;
    createdAt: string;
    avatar?: string;
    category?: string;
}

interface CsvState {
    invitations: Invitation[];
    total: number;
    loading: boolean;
    error: string | null;
    uploading: boolean;
    uploadError: string | null;
    csvTemplate: Blob | null;
    templateLoading: boolean;
    uploadResult: any | null;
}

const initialState: CsvState = {
    invitations: [],
    total: 0,
    loading: false,
    error: null,
    uploading: false,
    uploadError: null,
    csvTemplate: null,
    templateLoading: false,
    uploadResult: null,
};

export const fetchInvitations = createAsyncThunk(
    "csv/fetchInvitations",
    async (
        {
            page,
            limit,
            status,
            search,
        }: {
            page: number;
            limit: number;
            status: string;
            search: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await getInvitations(page, limit, status, search);
            return response.data; // Inner .data of the response object
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch invitations"
            );
        }
    }
);

export const uploadCsv = createAsyncThunk(
    "csv/uploadCsv",
    async (file: File, { rejectWithValue }) => {
        try {
            const response = await uploadCsvFile(file);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload CSV"
            );
        }
    }
);

export const fetchCsvTemplate = createAsyncThunk(
    "csv/fetchcsvTemplate",
    async (_, { rejectWithValue }) => {
        try {
            const response = await csvTemplate();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch CSV template"
            );
        }
    }
);

const csvSlice = createSlice({
    name: "csv",
    initialState,
    reducers: {
        clearCsvError: (state) => {
            state.error = null;
            state.uploadError = null;
            state.uploadResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvitations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvitations.fulfilled, (state, action) => {
                state.loading = false;
                const payloadData = action.payload || {};
                console.log("fetchInvitations payload:", payloadData);
                state.invitations = payloadData.invitations || payloadData.data || [];
                state.total = payloadData.pagination?.totalItems ?? payloadData.total ?? payloadData.totalCount ?? payloadData.count ?? payloadData.totalItems ?? (Array.isArray(payloadData.invitations) ? payloadData.invitations.length : 0);
            })
            .addCase(fetchInvitations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(uploadCsv.pending, (state) => {
                state.uploading = true;
                state.uploadError = null;
                state.uploadResult = null;
            })
            .addCase(uploadCsv.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadResult = action.payload.data;
            })
            .addCase(uploadCsv.rejected, (state, action) => {
                state.uploading = false;
                state.uploadError = action.payload as string;
            })
            //Fetch Csv Template
            .addCase(fetchCsvTemplate.pending, (state) => {
                state.templateLoading = true;
                state.error = null;
            })
            .addCase(fetchCsvTemplate.fulfilled, (state, action) => {
                state.templateLoading = false;
                state.csvTemplate = action.payload;
            })
            .addCase(fetchCsvTemplate.rejected, (state, action) => {
                state.templateLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCsvError } = csvSlice.actions;
export default csvSlice.reducer;
