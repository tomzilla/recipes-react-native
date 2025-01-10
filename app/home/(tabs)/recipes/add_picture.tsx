import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/SupabaseClient';
import { theme } from '@/constants/Colors';
import { ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  if (!auth.user) {
    return null;
  }
  const { fetchSavedRecipes } = useSavedRecipes(auth?.user?.id);

  const handleImagePick = async () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Upload Recipe Image ✨</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Select an Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, isLoading && styles.uploadButtonDisabled]}
        onPress={handleUpload}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.light.background} />
        ) : (
          <>
            <Text style={styles.uploadButtonText}>Extract & Save Recipe</Text>
            <ArrowRight size={20} color={theme.light.background} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light.background,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.light.textPrimary,
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: theme.light.surfaceAlt,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  imagePickerText: {
    fontSize: 16,
    color: theme.light.textSecondary,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: theme.light.brand,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: theme.light.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: theme.light.background,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
