import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { supabase } from '../services/SupabaseClient'; // Assuming you have this setup
import { Link, router } from 'expo-router';
import { Card, CardContent } from '@/vendor/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';
import { Button } from '@/vendor/components/ui/button';
import * as AppleAuthentication from 'expo-apple-authentication';

import '../global.css';
import { useAuth } from '@/hooks/useAuth';
import { withUser } from '@/components/WithUser';
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
});

const HomeScreen = () => {
  const auth = useAuth();
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setIsAppleAuthAvailable);
    }
  }, [])

  return (
    <View style={styles.container}>
      <Card className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-indigo-500" />
              <Text className="font-medium text-sm">Current Recipe Page</Text>
            </div>
            <Button 
              size="sm"
              className="w-full"
              disabled={true}
            >
              <Crown size={14} className="mr-1" />
              <Text>Upgrade to Transform This Recipe</Text>
            </Button>
              <Text className="text-xs text-gray-600 mt-2">Premium lets you transform any recipe you're viewing into a flowchart</Text>
          </CardContent>
        </Card>
      <Text style={styles.headerText}>Create an account</Text>
      
      {isAppleAuthAvailable && (
        <TouchableOpacity 
          style={[styles.authButton, styles.appleButton]}
          // onPress={handleAppleSignIn}
        >
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.authButton, styles.googleButton]}
        // onPress={handleGoogleSignIn}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.authButton, styles.emailButton]}
      >
        <Link 
          href={'/emailsignup'}
        >
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </Link>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => {router.push('/signin')}}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  authButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  emailButton: {
    backgroundColor: '#34495e',
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signInText: {
    color: '#666',
  },
  signInLink: {
    color: '#4285F4',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default withUser(HomeScreen);