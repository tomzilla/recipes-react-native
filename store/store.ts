import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tagsReducer from './tagsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
