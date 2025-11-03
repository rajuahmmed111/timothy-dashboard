import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Async thunk to get all users
export const getAllUsers = createAsyncThunk(
  "getAllUsers/fetch",
  async ({ page = 1, limit = 10, searchTerm = "", country = "", timeRange = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (country) params.append('country', country);
      if (timeRange) params.append('timeRange', timeRange);
      
      const res = await api.get(`/users?${params.toString()}`);
      return res.data; // Assumes response = { data: [...], total: number }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

const getAllUsersSlice = createSlice({
  name: "getAllUsers",
  initialState: {
    users: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getAllUsersSlice.reducer;
