// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

// Async thunk for creating user
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, thunkAPI) => {
    // console.log("user data", userData);
    try {
      const response = await api.post("/users", userData);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk for creating admin by super admin
export const createAdminBySuperAdmin = createAsyncThunk(
  "user/createAdminBySuperAdmin",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/users/add-role", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    success: false,
    user: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // createAdminBySuperAdmin handlers
      .addCase(createAdminBySuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAdminBySuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(createAdminBySuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
