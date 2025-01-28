
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/SupabaseClient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function SplashContainer() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const auth = useAuth();
  useEffect(() => {
    auth.checkUser();
    supabase.auth.onAuthStateChange((_event, session) => {
      auth.checkUser();
    })
  }, []);

  useEffect(() => {
    if (loaded && auth.initialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, auth.initialized]);

  if (!loaded) {
    return null;
  }

  return null;
}