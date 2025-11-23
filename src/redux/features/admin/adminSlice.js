import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

// ✅ Async thunk to fetch admins with dynamic page & limit
export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async ({ page = 1, limit = 10, status = "", searchTerm = "" }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (status) params.set("status", status);
      if (searchTerm) params.set("searchTerm", searchTerm);

      const response = await api.get(`/users/admins?${params.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ Initial state
const initialState = {
  admins: [],
  loading: false,
  error: null,
  meta: null, // If your API returns pagination info
};

// ✅ Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.loading = false;
        // Store the full data object so selectors using admins.data and admins.meta work
        state.admins = action.payload?.data || { data: [], meta: null };
        // Also expose meta at the root for convenience if needed elsewhere
        state.meta = action.payload?.data?.meta || null;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admins.";
      });
  },
});

export const { resetAdminState } = adminSlice.actions;

export default adminSlice.reducer;
