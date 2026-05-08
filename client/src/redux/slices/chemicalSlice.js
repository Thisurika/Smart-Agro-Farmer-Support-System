import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchChemicals = createAsyncThunk('chemicals/fetchAll', async (filters = {}, thunkAPI) => {
  try {
    const { keyword = '', category = '' } = filters;
    const { data } = await api.get(`/chemicals?keyword=${keyword}&category=${category}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch chemicals');
  }
});

export const fetchChemicalDetails = createAsyncThunk('chemicals/fetchDetails', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/chemicals/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch details');
  }
});

const chemicalSlice = createSlice({
  name: 'chemicals',
  initialState: {
    chemicals: [],
    chemical: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearChemicalDetails: (state) => {
      state.chemical = null;
    }
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(fetchChemicals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchChemicals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chemicals = action.payload;
    });
    builder.addCase(fetchChemicals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Details
    builder.addCase(fetchChemicalDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchChemicalDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chemical = action.payload;
    });
    builder.addCase(fetchChemicalDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearChemicalDetails } = chemicalSlice.actions;
export default chemicalSlice.reducer;
