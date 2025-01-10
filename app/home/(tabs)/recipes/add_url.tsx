import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Globe, ArrowRight, Sparkles, Rocket, Coffee, Clock, User } from 'lucide-react-native';
import { theme } from '@/constants/Colors';
import { supabase } from '@/services/SupabaseClient';
import { InsertSavedRecipeMutation } from '@/graphql/queries/InsertSavedRecipeMutation';
import { useAuth } from '@/hooks/useAuth';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

export default function WebsiteImport() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  if (!auth.user) {
    return null;
  }
  const { fetchSavedRecipes } = useSavedRecipes(auth.user.id);
  const handleImport = async () => {

    if (!isValidUrl(url.trim())) return;

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('generate-graph',
        {
          body: { url: url.trim() }
        }
      )
      console.log('Saving recipe to profile');

      await supabase.from('saved_recipes').upsert({ user_id: auth.user?.id, recipe_id: data.id, state: 'saved' })
      fetchSavedRecipes();
      router.push('/home/recipes');
    } catch (error) {
      console.error('Failed to import recipe:', error);
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
          <Globe size={32} color={theme.light.brand} />
          <Text style={styles.title}>Recipe Magic ✨</Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.tagline}>
            Say goodbye to endless scrolling through life stories about someone's great-aunt's neighbor's cat!
          </Text>

          <View style={styles.featureRow}>
            <Rocket size={20} color={theme.light.secondary} />
            <Text style={styles.featureText}>
              We zap away those 5-page stories and 17 popup ads faster than you can say "where's the recipe?"
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Coffee size={20} color={theme.light.secondary} />
            <Text style={styles.featureText}>
              Just the good stuff - ingredients and steps, organized so beautifully it'll bring a tear to your chef's eye
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Clock size={20} color={theme.light.secondary} />
            <Text style={styles.featureText}>
              Save it for later! Because let's be honest, you're probably in bed right now planning next week's meals 😉
            </Text>
          </View>
        </View>

        {/* URL Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Drop That URL Like It's Hot 🔥</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste that recipe link here!"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={handleImport}
          />
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={[
            styles.importButton,
            (!isValidUrl(url.trim()) || isLoading) && styles.importButtonDisabled
          ]}
          onPress={handleImport}
          disabled={!isValidUrl(url.trim()) || isLoading}
        >
          <Text style={styles.importButtonText}>
            {isLoading ? 'Working Magic... ✨' : 'Make It Simple! ✨'}
          </Text>
          {!isLoading && <ArrowRight size={20} color={theme.light.background} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function isValidUrl(url: string) {
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  if (!url.match(/^(http|https):\/\/[^ "]+\.([^ "]+\.)*[^ "]{2,}$/)) {
    return false;
  }
  try {
    const parsed = new URL(url);
    console.log(parsed);
    return parsed.hostname;
  } catch (error) {
    console.log(error);
    return false;
  }
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 8,
  },
  featureText: {
    fontSize: 16,
    color: theme.light.textSecondary,
    marginLeft: 12,
    flex: 1,
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
  input: {
    backgroundColor: theme.light.surfaceAlt,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: theme.light.textPrimary,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  importButton: {
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
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: theme.light.background,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});