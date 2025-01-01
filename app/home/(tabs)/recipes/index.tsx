import { LoggedIn } from "@/components/LoggedIn";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/services/database.types";
import { supabase } from "@/services/SupabaseClient";
import { useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const auth = useAuth();
  const [profile, setProfile] = useState<Tables<'user_profiles'> | null>(null);
  // const {content} = useClipboard();
  useEffect(() => {
    console.log("Dashboard page loaded with user: ", auth.user);
    
    if (!auth.user) return;

    (async () => {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', auth.user?.id).limit(1);
      if (data && data.length > 0) {
        setProfile(data[0]);
      } else {
        console.warn("Error getting user profile: ", error);
      }
    })();
  }, [auth.user]);

  const rootNavigationState = useRootNavigationState();

  console.log("Root navigation state: ", rootNavigationState);
  if (!rootNavigationState?.key) return null;

  if (!auth.user) {
    // router.navigate('/loggedout');
  }

  return (<View>
    <LoggedIn 
      user={auth.user} 
      userProfile={profile} 
    />
  </View>);
}