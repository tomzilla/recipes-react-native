import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser, setLoading, setError, setInitialized } from '../store/authSlice';
import { supabase } from '../services/SupabaseClient';
import { RootState } from '@/store/store';
import { AuthError } from 'expo-auth-session';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, initialized } = useSelector((state: RootState) => state.auth);

  const handleSignIn = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { data, error: signInError } = await supabase.auth.signInWithPassword({email, password});
      
      if (signInError) throw signInError;
      
      if (data?.user) {
        dispatch(setUser(data.user));
      }
    } catch (error) {
      dispatch(setError((error as AuthError).message));
    } finally {
      dispatch(setLoading(false));
      dispatch(setInitialized());
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { data, error: signUpError } = await supabase.auth.signUp({email, password});
      
      if (signUpError) throw signUpError;
      
      if (data?.user) {
        dispatch(setUser(data.user));
      }
    } catch (error) {
      dispatch(setError((error as AuthError).message));
    } finally {
      dispatch(setLoading(false));
      dispatch(setInitialized());
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(setLoading(true));
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      dispatch(clearUser());
    } catch (error) {
      dispatch(setError((error as AuthError).message));
    } finally {
      dispatch(setLoading(false));
      dispatch(setInitialized());
    }
  };

  const checkUser = async () => {
    try {
      dispatch(setLoading(true));
      const { data: { session }, error: userError } = await supabase.auth.getSession();
      
      if (userError) throw userError;
      
      if (session) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    } catch (userError) {
      const err = userError as AuthError;
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
      dispatch(setInitialized());
    }
  };

  return {
    user,
    isLoading,
    error,
    handleSignIn,
    handleSignOut,
    handleSignUp,
    checkUser,
    initialized,
  };
};
