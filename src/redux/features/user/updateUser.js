import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Async thunk for getting a single user
export const updateUser = createAsyncThunk(
  "admin/updateUser", // ✅ consistent slice name
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/users/update`);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);
