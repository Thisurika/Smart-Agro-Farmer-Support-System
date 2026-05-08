import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cropReducer from './slices/cropSlice';
import feedbackReducer from './slices/feedbackSlice';
import chemicalReducer from './slices/chemicalSlice';
import cartReducer from './slices/cartSlice';
import paymentReducer from './slices/paymentSlice';
import weatherReducer from './slices/weatherSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import chatbotReducer from './slices/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crops: cropReducer,
    feedbacks: feedbackReducer,
    chemicals: chemicalReducer,
    cart: cartReducer,
    payments: paymentReducer,
    weather: weatherReducer,
    users: userReducer,
    notifications: notificationReducer,
    chatbot: chatbotReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
