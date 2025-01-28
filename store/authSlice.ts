import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/auth';
import { AuthSession, User } from '@supabase/supabase-js';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  initialized: false,
  error: null,
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setSession:(state, action: PayloadAction<AuthSession>) => {
      state.session = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
});
export const { setUser, clearUser, setLoading, setError, setInitialized, setSession } = authSlice.actions;
export default authSlice.reducer;
