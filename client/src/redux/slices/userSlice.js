import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRoleStatus = createAsyncThunk(
  'users/updateUserRoleStatus',
  async ({ id, role, isActive }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}`, { role, isActive });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null
  },
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUserRoleStatus.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateUserRoleStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) => 
          user._id === updatedUser._id ? { ...user, ...updatedUser } : user
        );
      })
      .addCase(updateUserRoleStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  }
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
