import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchCrops = createAsyncThunk('crops/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/crops');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch crops');
  }
});

export const fetchCropDetails = createAsyncThunk('crops/fetchSingle', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/crops/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch crop details');
  }
});

export const createCrop = createAsyncThunk('crops/create', async (cropData, thunkAPI) => {
  try {
    const { data } = await api.post('/crops', cropData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to create crop');
  }
});

export const updateCrop = createAsyncThunk('crops/update', async ({ id, cropData }, thunkAPI) => {
  try {
    const { data } = await api.put(`/crops/${id}`, cropData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to update crop');
  }
});

export const deleteCrop = createAsyncThunk('crops/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/crops/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to delete crop');
  }
});

const initialState = {
  crops: [],
  currentCrop: null,
  isLoading: false,
  error: null,
};

const cropSlice = createSlice({
  name: 'crops',
  initialState,
  reducers: {
    clearCropError: (state) => {
      state.error = null;
    },
    clearCurrentCrop: (state) => {
      state.currentCrop = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Crops
    builder.addCase(fetchCrops.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCrops.fulfilled, (state, action) => {
      state.isLoading = false;
      state.crops = action.payload;
    });
    builder.addCase(fetchCrops.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Single Crop
    builder.addCase(fetchCropDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCropDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentCrop = action.payload;
    });
    builder.addCase(fetchCropDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create Crop
    builder.addCase(createCrop.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCrop.fulfilled, (state, action) => {
      state.isLoading = false;
      state.crops.unshift(action.payload);
    });
    builder.addCase(createCrop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update Crop
    builder.addCase(updateCrop.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCrop.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.crops.findIndex((crop) => crop._id === action.payload._id);
      if (index !== -1) {
        state.crops[index] = action.payload;
      }
      state.currentCrop = action.payload;
    });
    builder.addCase(updateCrop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete Crop
    builder.addCase(deleteCrop.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCrop.fulfilled, (state, action) => {
      state.isLoading = false;
      state.crops = state.crops.filter((crop) => crop._id !== action.payload);
    });
    builder.addCase(deleteCrop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearCropError, clearCurrentCrop } = cropSlice.actions;
export default cropSlice.reducer;
