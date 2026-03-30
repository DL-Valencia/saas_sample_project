import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  applications: [],
  application: null,
  stats: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getApplications = createAsyncThunk('applications/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get('/api/applications', config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getStats = createAsyncThunk('applications/getStats', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get('/api/applications/stats', config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = action.payload.applications;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
