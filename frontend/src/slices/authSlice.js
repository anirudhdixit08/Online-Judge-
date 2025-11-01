
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.replace('Error : Error: ', '') ||
                      error.response?.data || 
                      error.message || 
                      'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.replace('Error : Error: ', '') ||
                      error.response?.data || 
                      error.message || 
                      'Invalid credentials';
      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Not authenticated';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/logout');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);



export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/sendotp', payload);
      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data || 
                      error.message || 
                      'Error sending OTP';
      return rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: null,

    isOtpSent: false,
    otpLoading: false,
    otpError: null,
    otpSuccess: null,
  },
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    clearOtpMessages: (state) => {
      state.otpError = null;
      state.otpSuccess = null;
    },
    resetSignupFlow: (state) => {
      state.isOtpSent = false;
      state.otpLoading = false;
      state.otpError = null;
      state.otpSuccess = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.otpError = null; 
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload.user;
        state.user = action.payload.user;
        state.success = action.payload.message;
        state.isOtpSent = false;
        state.otpSuccess = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.otpError = null;
        state.otpSuccess = null;
        state.isOtpSent = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload.user;
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(sendOTP.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.otpSuccess = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSuccess = action.payload.message;
        state.isOtpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
        state.isOtpSent = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.success = action.payload;
        state.isOtpSent = false;
        state.otpSuccess = null;
        state.otpError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAuthMessages, clearOtpMessages, resetSignupFlow } = authSlice.actions;

export default authSlice.reducer;