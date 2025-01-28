import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/services/SupabaseClient";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function withUser<P extends {}>(Component: React.ComponentType<P>) {
  const newComponent = (props: P) => {
    const auth = useAuth();
    // Check if user is logged in
    useEffect(() => {
      auth.checkUser();
      supabase.auth.onAuthStateChange((_event, session) => {
        auth.checkUser();
      });

      console.log('checking user');

    }, []);
    const [userInitiated, setUserInitiated] = useState(false);
    useEffect(() => {
      if (auth.initialized) {
        setUserInitiated(true);
      }
    }, [auth.initialized]);
    // useEffect(() => {
    //   if (auth.user && !auth.isLoading) {
    //     router.replace('/home/recipes');
    //   }
    // }, [auth.user, auth.isLoading]);
    
    if (!userInitiated) {
      return null;
    }
    return <Component {...props} />;
  };
  return newComponent;
}
