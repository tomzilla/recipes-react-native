import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { theme } from '@/constants/Colors';
import { supabase } from '@/services/SupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

export default function TextImport() {
  const [recipeText, setRecipeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  if (!auth.user) {
    return null;
  }
  const { fetchSavedRecipes } = useSavedRecipes(auth.user.id);

  const handleSave = async () => {
    if (!recipeText.trim()) return;

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('generate-graph', {
        body: { text: recipeText.trim() },
      });

      console.log('Saving parsed recipe to profile');
      await supabase.from('saved_recipes').upsert({
        user_id: auth?.user?.id,
        recipe_id: data.id,
        state: 'saved',
      });

      fetchSavedRecipes();
      router.push('/home/recipes');
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setIsLoading(false);
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
          <Sparkles size={32} color={theme.light.brand} />
          <Text style={styles.title}>Recipe Input ✍️</Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.tagline}>
            Type or paste your recipe below and let us organize it for you!
          </Text>
        </View>

        {/* Text Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Recipe Text</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Paste your recipe here!"
            value={recipeText}
            onChangeText={setRecipeText}
            multiline
            autoCapitalize="sentences"
            autoCorrect={true}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!recipeText.trim() || isLoading) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!recipeText.trim() || isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving Recipe... ✨' : 'Save Recipe ✨'}
          </Text>
          {!isLoading && <ArrowRight size={20} color={theme.light.background} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.light.textPrimary,
    marginBottom: 16,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.light.textPrimary,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: theme.light.surfaceAlt,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: theme.light.textPrimary,
    borderWidth: 1,
    borderColor: theme.light.border,
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: theme.light.brand,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: theme.light.background,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
