import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Send Chat Message ────────────────────────────────
export const sendChatMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ message, disease, history }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/chatbot/message', {
        message,
        disease,
        history,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// ─── Predict Disease (via Node.js proxy to Flask) ─────
export const predictDisease = createAsyncThunk(
  'chatbot/predictDisease',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token for the proxy endpoint
      const userInfoStr = localStorage.getItem('userInfo');
      let token = '';
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          token = userInfo?.token || '';
        } catch { /* ignore */ }
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/chatbot/predict`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        return rejectWithValue(
          data.error || data.message || 'Disease detection failed'
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Disease detection failed');
    }
  }
);

// ─── Fetch FAQ ────────────────────────────────────────
export const fetchFAQ = createAsyncThunk(
  'chatbot/fetchFAQ',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/chatbot/faq');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load FAQ');
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    messages: [],
    isOpen: false,
    isLoading: false,
    error: null,
    // Disease detection
    prediction: null,
    isPredicting: false,
    predictionError: null,
    // FAQ
    faq: [],
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.prediction = null;
      state.predictionError = null;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setDiseaseContext: (state, action) => {
      state.prediction = action.payload;
    },
    clearPrediction: (state) => {
      state.prediction = null;
      state.predictionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
          source: action.payload.source,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'assistant',
          content: 'Sorry, I could not connect right now. Please try again or consult a local expert.',
          timestamp: new Date().toISOString(),
          isError: true,
        });
      })
      // Predict Disease
      .addCase(predictDisease.pending, (state) => {
        state.isPredicting = true;
        state.predictionError = null;
      })
      .addCase(predictDisease.fulfilled, (state, action) => {
        state.isPredicting = false;
        state.prediction = action.payload;
      })
      .addCase(predictDisease.rejected, (state, action) => {
        state.isPredicting = false;
        state.predictionError = action.payload;
      })
      // FAQ
      .addCase(fetchFAQ.fulfilled, (state, action) => {
        state.faq = action.payload;
      });
  },
});

export const {
  toggleChat,
  openChat,
  closeChat,
  clearChat,
  addUserMessage,
  setDiseaseContext,
  clearPrediction,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
