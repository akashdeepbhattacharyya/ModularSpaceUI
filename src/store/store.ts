import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import commonSlice from '../slices/commonSlice';

export const store = configureStore({
  reducer: {
    common: commonSlice,
    user: userReducer,
  },
});

// Types for hooks and slices
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
