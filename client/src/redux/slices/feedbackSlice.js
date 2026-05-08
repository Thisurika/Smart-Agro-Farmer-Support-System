import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchFeedbacks = createAsyncThunk('feedbacks/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/feedbacks');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch feedbacks');
  }
});

export const createFeedback = createAsyncThunk('feedbacks/create', async (feedbackData, thunkAPI) => {
  try {
    const { data } = await api.post('/feedbacks', feedbackData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to submit feedback');
  }
});

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState: {
    feedbacks: [],
    isLoading: false,
    error: null,
    submitSuccess: false,
  },
  reducers: {
    clearFeedbackState: (state) => {
      state.error = null;
      state.submitSuccess = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchFeedbacks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeedbacks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.feedbacks = action.payload;
    });
    builder.addCase(fetchFeedbacks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create
    builder.addCase(createFeedback.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.submitSuccess = false;
    });
    builder.addCase(createFeedback.fulfilled, (state, action) => {
      state.isLoading = false;
      state.submitSuccess = true;
      state.feedbacks.unshift(action.payload);
    });
    builder.addCase(createFeedback.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.submitSuccess = false;
    });
  },
});

export const { clearFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
