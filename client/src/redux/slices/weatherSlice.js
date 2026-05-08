import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===================== WEATHER THUNKS =====================

export const fetchWeather = createAsyncThunk('weather/fetchCurrent', async (params, thunkAPI) => {
  try {
    const { city } = params;
    const { data } = await api.get(`/weather?city=${encodeURIComponent(city)}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch weather');
  }
});

export const fetchSriLankaWeather = createAsyncThunk('weather/fetchSriLanka', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/weather/sri-lanka');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch Sri Lanka weather');
  }
});

export const fetchWeatherHistory = createAsyncThunk('weather/fetchHistory', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/weather/history');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch weather history');
  }
});

export const deleteWeatherHistory = createAsyncThunk('weather/deleteHistory', async (_, thunkAPI) => {
  try {
    const { data } = await api.delete('/weather/history');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to clear history');
  }
});

export const fetchMyFarmWeather = createAsyncThunk('weather/fetchMyFarm', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/weather/my-farm');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch farm weather');
  }
});

// ===================== ALERT THUNKS =====================

export const fetchWeatherAlerts = createAsyncThunk('weather/fetchAlerts', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/weather/alerts');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch alerts');
  }
});

export const createWeatherAlert = createAsyncThunk('weather/createAlert', async (alertData, thunkAPI) => {
  try {
    const { data } = await api.post('/weather/alerts', alertData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to create alert');
  }
});

export const updateWeatherAlert = createAsyncThunk('weather/updateAlert', async ({ id, ...alertData }, thunkAPI) => {
  try {
    const { data } = await api.put(`/weather/alerts/${id}`, alertData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to update alert');
  }
});

export const deleteWeatherAlert = createAsyncThunk('weather/deleteAlert', async (id, thunkAPI) => {
  try {
    await api.delete(`/weather/alerts/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to delete alert');
  }
});

// ===================== FARMING TIP THUNKS =====================

export const fetchFarmingTips = createAsyncThunk('weather/fetchTips', async (condition, thunkAPI) => {
  try {
    const query = condition ? `?condition=${encodeURIComponent(condition)}` : '';
    const { data } = await api.get(`/weather/tips${query}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch tips');
  }
});

export const createFarmingTip = createAsyncThunk('weather/createTip', async (tipData, thunkAPI) => {
  try {
    const { data } = await api.post('/weather/tips', tipData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to create tip');
  }
});

export const updateFarmingTip = createAsyncThunk('weather/updateTip', async ({ id, ...tipData }, thunkAPI) => {
  try {
    const { data } = await api.put(`/weather/tips/${id}`, tipData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to update tip');
  }
});

export const deleteFarmingTip = createAsyncThunk('weather/deleteTip', async (id, thunkAPI) => {
  try {
    await api.delete(`/weather/tips/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to delete tip');
  }
});

// ===================== DISTRICTS =====================

export const fetchDistricts = createAsyncThunk('weather/fetchDistricts', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/weather/districts');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch districts');
  }
});

// ===================== SLICE =====================

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    farmWeather: null,
    sriLankaWeather: [],
    history: [],
    alerts: [],
    tips: [],
    districts: [],
    isLoading: false,
    isSriLankaLoading: false,
    error: null,
  },
  reducers: {
    clearWeatherError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Current Weather
    builder.addCase(fetchWeather.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(fetchWeather.fulfilled, (state, action) => { state.isLoading = false; state.currentWeather = action.payload; });
    builder.addCase(fetchWeather.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Sri Lanka bulk
    builder.addCase(fetchSriLankaWeather.pending, (state) => { state.isSriLankaLoading = true; state.error = null; });
    builder.addCase(fetchSriLankaWeather.fulfilled, (state, action) => { state.isSriLankaLoading = false; state.sriLankaWeather = action.payload; });
    builder.addCase(fetchSriLankaWeather.rejected, (state, action) => { state.isSriLankaLoading = false; state.error = action.payload; });

    // History
    builder.addCase(fetchWeatherHistory.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(fetchWeatherHistory.fulfilled, (state, action) => { state.isLoading = false; state.history = action.payload; });
    builder.addCase(fetchWeatherHistory.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // Delete History
    builder.addCase(deleteWeatherHistory.fulfilled, (state) => { state.history = []; });

    // Farm Weather
    builder.addCase(fetchMyFarmWeather.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(fetchMyFarmWeather.fulfilled, (state, action) => { state.isLoading = false; state.farmWeather = action.payload; });
    builder.addCase(fetchMyFarmWeather.rejected, (state, action) => { state.isLoading = false; state.farmWeather = null; });

    // Alerts
    builder.addCase(fetchWeatherAlerts.fulfilled, (state, action) => { state.alerts = action.payload; });
    builder.addCase(createWeatherAlert.fulfilled, (state, action) => { state.alerts.unshift(action.payload); });
    builder.addCase(updateWeatherAlert.fulfilled, (state, action) => {
      const idx = state.alerts.findIndex(a => a._id === action.payload._id);
      if (idx !== -1) state.alerts[idx] = action.payload;
    });
    builder.addCase(deleteWeatherAlert.fulfilled, (state, action) => {
      state.alerts = state.alerts.filter(a => a._id !== action.payload);
    });

    // Tips
    builder.addCase(fetchFarmingTips.fulfilled, (state, action) => { state.tips = action.payload; });
    builder.addCase(createFarmingTip.fulfilled, (state, action) => { state.tips.unshift(action.payload); });
    builder.addCase(updateFarmingTip.fulfilled, (state, action) => {
      const idx = state.tips.findIndex(t => t._id === action.payload._id);
      if (idx !== -1) state.tips[idx] = action.payload;
    });
    builder.addCase(deleteFarmingTip.fulfilled, (state, action) => {
      state.tips = state.tips.filter(t => t._id !== action.payload);
    });

    // Districts
    builder.addCase(fetchDistricts.fulfilled, (state, action) => { state.districts = action.payload; });
  },
});

export const { clearWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;
