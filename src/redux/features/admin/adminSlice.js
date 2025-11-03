import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

// ✅ Async thunk to fetch admins with dynamic page & limit
export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/users/admins?page=${page}&limit=${limit}`);
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
        state.admins = action.payload?.data || [];
        state.meta = action.payload?.meta || null;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admins.";
      });
  },
});

export const { resetAdminState } = adminSlice.actions;

export default adminSlice.reducer;
