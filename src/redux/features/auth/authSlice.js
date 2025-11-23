import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { jwtDecode } from "jwt-decode";

// Safely parse token and extract userId
let accessToken = localStorage.getItem("accessToken");

// Async Thunk: Update Profile Image (multipart/form-data)
export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await api.patch("/users/profile-img-update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data || null;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile image";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
let refreshToken = localStorage.getItem("refreshToken");
let userId = null;

if (accessToken) {
  try {
    const decoded = jwtDecode(accessToken);
    userId = decoded.id || null;
  } catch (error) {
    console.error("Invalid access token", error);
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

// Initial state
const initialState = {
  token: accessToken,
  refreshToken: refreshToken,
  userId: userId,
  user: null,
  loading: false,
  error: null,
};

// Async Thunk: User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data.data; // Expected: { accessToken, refreshToken }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk: Get Logged In User's Profile
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/my-profile");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fix the updateUserProfile thunk
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData, thunkAPI) => {
    try {
      const response = await api.patch("/users/update", updatedData);
      console.log(updatedData);
      console.log(response);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (updatedPass, thunkAPI) => {
    try {
      const response = await api.put("/auth/change-password", updatedPass);
      console.log(updatedPass);
      console.log(response);
      return response.data.data;
    } catch (error) { 
      const message =
        error.response?.data?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await api.post("/auth/forgot-password", {email});
      console.log(email);
      console.log(response);
      return response.data.data;
    } catch (error) { 
      const message =
        error.response?.data?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const checkOTP = createAsyncThunk(
  "auth/verify-otp",
  async (otp, thunkAPI) => {
    try {
      const response = await api.post("/auth/verify-otp", {otp});
      console.log(otp);
      console.log(response);
      return response.data.data;
    } catch (error) { 
      const message =
        error.response?.data?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;
        try {
          const decoded = jwtDecode(accessToken);
          state.token = accessToken;
          state.refreshToken = refreshToken;
          state.userId = decoded.id;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        } catch (error) {
          console.error("Token decode error:", error);
          state.error = "Invalid token received";
        }
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile Image
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update user profile image if returned
        if (state.user && action.payload?.profileImage) {
          state.user.profileImage = action.payload.profileImage;
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update user
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // update user in store
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
