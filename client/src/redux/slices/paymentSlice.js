import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createPayment = createAsyncThunk('payments/create', async (paymentData, thunkAPI) => {
  try {
    const { data } = await api.post('/payments', paymentData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Payment processing failed');
  }
});

export const fetchMyPayments = createAsyncThunk('payments/fetchMy', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/payments/my-payments');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch payments');
  }
});

export const fetchAllPayments = createAsyncThunk('payments/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/payments');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch all payments');
  }
});

export const updatePaymentStatus = createAsyncThunk('payments/updateStatus', async ({ id, status, adminNotes }, thunkAPI) => {
  try {
    const { data } = await api.put(`/payments/${id}/status`, { status, adminNotes });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to update status');
  }
});

export const requestRefund = createAsyncThunk('payments/requestRefund', async ({ id, refundReason }, thunkAPI) => {
  try {
    const { data } = await api.put(`/payments/${id}/refund-request`, { refundReason });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to request refund');
  }
});

export const processRefund = createAsyncThunk('payments/processRefund', async ({ id, status, adminNotes }, thunkAPI) => {
  try {
    const { data } = await api.put(`/payments/${id}/refund-process`, { status, adminNotes });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to process refund');
  }
});

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    paymentStatus: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetPaymentStatus: (state) => {
      state.paymentStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create Payment
    builder.addCase(createPayment.pending, (state) => {
      state.isLoading = true;
      state.paymentStatus = 'pending';
    });
    builder.addCase(createPayment.fulfilled, (state) => {
      state.isLoading = false;
      state.paymentStatus = 'success';
    });
    builder.addCase(createPayment.rejected, (state, action) => {
      state.isLoading = false;
      state.paymentStatus = 'failed';
      state.error = action.payload;
    });

    // Fetch My Payments
    builder.addCase(fetchMyPayments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMyPayments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchMyPayments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch All Payments
    builder.addCase(fetchAllPayments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllPayments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchAllPayments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update Status, Request Refund, Process Refund
    builder.addMatcher(
      (action) => [updatePaymentStatus.fulfilled, requestRefund.fulfilled, processRefund.fulfilled].includes(action.type),
      (state, action) => {
        state.isLoading = false;
        state.payments = state.payments.map(p => p._id === action.payload._id ? action.payload : p);
      }
    );
    builder.addMatcher(
      (action) => [updatePaymentStatus.pending, requestRefund.pending, processRefund.pending].includes(action.type),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      (action) => [updatePaymentStatus.rejected, requestRefund.rejected, processRefund.rejected].includes(action.type),
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
