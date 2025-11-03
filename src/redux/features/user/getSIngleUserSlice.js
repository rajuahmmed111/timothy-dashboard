// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Async thunk for getting a single user
export const getSingleUser = createAsyncThunk(
  "singleUser/getSingleUser", // ✅ consistent slice name
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/users/${id}`);
      //   console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk for getting user finances
export const getUserFinances = createAsyncThunk(
  "singleUser/getUserFinances",
  async ({ userId, page = 1 }, thunkAPI) => {
    try {
      const response = await api.get(`/finances/user/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk for getting provider finances
export const getProviderFinances = createAsyncThunk(
  "singleUser/getProviderFinances",
  async ({ providerId, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/finances/provider/${providerId}?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk for deleting a single user
export const deleteSingleUser = createAsyncThunk(
  "singleUser/deleteSingleUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const initialState = {
  singleUser: null,
  userFinances: null,
  loading: false,
  financesLoading: false,
  error: null,
  financesError: null,
};

const singleUserSlice = createSlice({
  name: "singleUser", // ✅ name matches slice in store
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.singleUser = null;
      state.userFinances = null;
      state.error = null;
      state.financesError = null;
      state.loading = false;
      state.financesLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ handle deleteSingleUser thunk
      .addCase(deleteSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSingleUser.fulfilled, (state) => {
        state.loading = false;
        state.singleUser = null; // user is deleted
      })
      .addCase(deleteSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getUserFinances thunk
      .addCase(getUserFinances.pending, (state) => {
        state.financesLoading = true;
        state.financesError = null;
      })
      .addCase(getUserFinances.fulfilled, (state, action) => {
        state.financesLoading = false;
        state.userFinances = action.payload;
      })
      .addCase(getUserFinances.rejected, (state, action) => {
        state.financesLoading = false;
        state.financesError = action.payload;
      })

      // Handle getProviderFinances thunk
      .addCase(getProviderFinances.pending, (state) => {
        state.financesLoading = true;
        state.financesError = null;
      })
      .addCase(getProviderFinances.fulfilled, (state, action) => {
        state.financesLoading = false;
        state.userFinances = action.payload;
      })
      .addCase(getProviderFinances.rejected, (state, action) => {
        state.financesLoading = false;
        state.financesError = action.payload;
      });
  },
});

export const { resetUserState } = singleUserSlice.actions;
export default singleUserSlice.reducer;
