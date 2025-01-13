import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/SupabaseClient';
import { theme } from '@/constants/Colors';
import { ArrowRight, Camera } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  if (!auth.user) {
    return null;
  }
  const { fetchSavedRecipes } = useSavedRecipes(auth?.user?.id);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append(`recipe_${Date.now()}.jpg`, image);

      const { data } = await supabase.functions.invoke('analyze-image', {
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await supabase.from('saved_recipes').upsert({
        user_id: auth.user?.id,
        recipe_id: data.id,
        state: 'saved',
      });
      fetchSavedRecipes();

      Alert.alert('Success', 'Recipe extracted and saved successfully!');
    } catch (error) {
      console.error('Error extracting recipe:', error);
      Alert.alert('Error', 'Failed to analyze the image and save the recipe.');
    } finally {
      setIsLoading(false);
      setImage(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Camera size={32} color={theme.light.brand} />
          <Text style={styles.title}>Recipe Snap ✨</Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Got a recipe on a piece of paper or in a cookbook? Snap a pic, and let our AI work its magic. No more typing out recipes like it’s 1999. 🕺
          </Text>
        </View>

        {/* Image Picker Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Upload Your Recipe Image 📸</Text>
          <TouchableOpacity onPress={pickImage} style={styles.inputButton}>
            <Text style={styles.inputButtonText}>Choose an Image</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image source={{ uri: image }} style={styles.preview} />
        )}

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleUpload}
          style={[styles.inputButton, !image && styles.buttonDisabled]}
          disabled={!image || isLoading}
        >
          <Text style={styles.inputButtonText}>
            {isLoading ? 'Analyzing Image... 🔬' : 'Extract Recipe 🍲'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.light.textPrimary,
    marginLeft: 12,
  },
  descriptionContainer: {
    backgroundColor: theme.light.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: '100%',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.light.textPrimary,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.light.textPrimary,
    marginBottom: 8,
  },
  inputButton: {
    backgroundColor: theme.light.brand,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.light.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: theme.light.border,
  },
  inputButtonText: {
    color: theme.light.background,
    fontSize: 18,
    fontWeight: '600',
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
});
