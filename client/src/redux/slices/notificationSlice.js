import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id, thunkAPI) => {
  try {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to mark notification as read');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(markNotificationRead.fulfilled, (state, action) => {
      state.notifications = state.notifications.map(n => n._id === action.payload._id ? action.payload : n);
    });
  },
});

export default notificationSlice.reducer;
