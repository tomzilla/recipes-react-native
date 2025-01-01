import { useEffect, useState } from 'react'
import './App.css'
import { supabaseClient } from './SupabaseClient';
import { LoggedOut } from './components/LoggedOut';
import { LoggedIn } from './components/LoggedIn';
import { User } from '@supabase/supabase-js';
import { Tables } from './database.types';
function App() {
  console.log('APP INIT, ', new Date().toLocaleString());
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'user_profiles'> | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      const user = session?.user;
      console.log("logged in: ", user);
      if (user) {
        const { data, error } = await supabaseClient.from('user_profiles').select('*').eq('id', user.id).limit(1);
        if (data && data.length > 0) {
            setProfile(data[0]);
        } else {
            console.warn("Error getting user profile: ", error);
        }
        setChecked(true);
        setLoggedInUser(user);
        console.log('APP set user, ', new Date().toLocaleString());

        supabaseClient.auth.refreshSession();
      }
    })();
  }, []);
  return checked ? (
      (loggedInUser ? <LoggedIn user={loggedInUser} userProfile={profile} /> : <LoggedOut />)) : "Loading...";
}

export default App
