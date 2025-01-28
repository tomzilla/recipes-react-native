import { NewColorMode } from '@/constants/NewColors';
import { useAuth } from '@/hooks/useAuth';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface LoginComponentProps {
  prefilledEmail?: string;
  onSignUp?: (email: string, password: string) => void;
  onAppleLogin?: () => void;
  onSignIn?: (email: string, password: string) => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({
  prefilledEmail,
  onSignUp,
  onAppleLogin,
  onSignIn,
}) => {
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
  }, [password, email]);
  useEffect(() => {
    if (auth.user && auth.session) {
      router.replace('/home/(tabs)/recipes');
    } else if (auth.user) {
      setPassword('');
      setEmail(auth?.user?.email || '');
      if (!auth?.user?.email_confirmed_at && !auth?.user?.last_sign_in_at) {
        setSuccessMessage(`Account created! We've sent a confirmation email to ${auth?.user?.email}. 
          Please check your inbox to verify your email address before signing in.`);
      }
      setIsSignUp(false);
    }
  }, [auth.user, auth.session])

  const handleSignUp = () => {
    (async () => {
      await auth.handleSignUp(email, password);
      onSignUp && onSignUp(email, password);
    })();

  };

  const handleSignIn = () => {
    (async () => {
      await auth.handleSignIn(email, password);
      onSignIn && onSignIn(email, password);
    })();
  };

  const handleSubmit = () => {
    if (!email || !password) {
      setErrorMessage('Please enter an email and password');
      return;
    }
    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const styles = getStyles(useColors());
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >

        {/* Error Message Area */}
        {errorMessage ? (
          <View style={[styles.messageContainer, styles.errorMessageContainer]}>
            <Text style={styles.errorMessageText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Success Message Area */}
        {successMessage ? (
          <View style={[styles.messageContainer, styles.successMessageContainer]}>
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </View>
        ) : null}
        <View style={styles.loginBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#555555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.toggleText}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.toggleTextContent}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'Don\'t have an account? Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              text={isSignUp ? 'Sign Up' : 'Sign In'}
              onPress={handleSubmit}
            />

            <TouchableOpacity
              style={styles.appleButton}
              onPress={onAppleLogin}
            >
              <Text style={styles.appleButtonText}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
function getStyles(colors: NewColorMode) {
  return StyleSheet.create({
    topContent: {
      flex: 1,
    },
    title: {

      fontSize: 24,
      fontWeight: '600',
      color: colors.brand,
      textAlign: 'center',
      marginVertical: 32,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    keyboardAvoidView: {
      width: '100%',
      alignItems: 'center',
    },
    messageContainer: {
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    errorMessageContainer: {
      backgroundColor: '#FFE5E5',
    },
    errorMessageText: {
      color: '#D8000C',
      fontSize: 14,
    },
    successMessageContainer: {
      backgroundColor: '#E5F6E5',
    },
    successMessageText: {
      color: '#008000',
      fontSize: 14,
    },
    loginBox: {
      width: width * 0.9,
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 50,
      backgroundColor: '#F4F4F6',
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      color: '#242426',
    },
    toggleText: {
      alignItems: 'center',
      marginBottom: 24,
    },
    toggleTextContent: {
      color: '#555555',
      fontSize: 14,
    },
    buttonContainer: {
      gap: 16,
    },
    mainButton: {
      backgroundColor: '#FF642F',
      paddingVertical: 16,
      borderRadius: 50,
      alignItems: 'center',
    },
    mainButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    appleButton: {
      backgroundColor: 'black',
      paddingVertical: 16,
      borderRadius: 50,
      alignItems: 'center',
    },
    appleButtonText: {
      color: colors.white,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
    },
  });
}