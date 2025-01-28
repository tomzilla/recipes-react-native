import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, AppState, Dimensions } from 'react-native';
import { supabase } from '../services/SupabaseClient'; // Assuming you have this setup
import { Asset, useAssets } from 'expo-asset';
import '../global.css';
import { withUser } from '@/components/WithUser';
import { TutorialFlow } from '@/components/Tutorial';
import SignIn from './signin';
import { router } from 'expo-router';
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
  const [assets] = useAssets([require('../assets/images/splash.jpg')]);

  return (
    <View style={{
      backgroundImage: assets ? `url(${assets[0].uri})` : 'none',
      ...styles.container
    }}>
      <View style={styles.innerContainer}>
        <TutorialFlow onComplete={() => {
          router.replace('/signin');
        }} />
      </View>

    </View>
  );
};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  innerContainer: {
    margin: 50,
    width: width * 0.9,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundSize: 'fill',
  },
})

export default withUser(HomeScreen);