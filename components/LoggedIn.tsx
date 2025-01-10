import { useEffect, useState } from 'react';
import { ChefHat, Crown, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SavedRecipes } from './SavedRecipes.tsx';
import { GenerateButton } from './GenerateButton.tsx';
import { supabase } from '@/services/SupabaseClient.ts';
import { Button } from '@/vendor/components/ui/button.tsx';
import { Card, CardContent } from '@/vendor/components/ui/card.tsx';
import { Tables } from '@/services/database.types.ts';
import { Text } from '@rneui/themed';
import TagsFilter from './TagsFilter.tsx';
import { useTags } from '@/hooks/useTags.ts';
import { SavedRecipesType } from '@/types/saved_recipes.ts';
import { useSavedRecipes } from '@/hooks/useSavedRecipes.ts';

interface LoggedInProps {
  user: User | null,
  userProfile: Tables<'user_profiles'> | null,
}
export function LoggedIn({ user, userProfile }: LoggedInProps) {
  if (!user) {
    return null;
  }
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipesType[]>([]);
  const {
    selectedTags,
  } = useTags();
  const [isPremium, setIsPremium] = useState(true);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      if (userProfile) {
        // setIsPremium(userProfile.plan == 'paid');
        setIsPremium(true);
      }
    })();

  }, [user])

  const {recipes, fetchSavedRecipes} = useSavedRecipes(user.id);
  useEffect(() => {
    fetchSavedRecipes();
  }, [refresh, user]);

  useEffect(() => {
    console.log("Selected tags changed: ", selectedTags);
      if (selectedTags.length == 0) {
        setFilteredRecipes(recipes);
        return;
      } else {
        const filtered = recipes.filter(recipe => {
          return recipe.recipe.recipe_tags.some(tag => selectedTags.includes(tag.tag.id));
        });
        setFilteredRecipes(filtered);
      }
  }, [selectedTags, recipes]);

  return (
    <div className="p-4 bg-white">
      <TagsFilter
        onSelectionChange={(tags) => { }}
      />
      {/* Saved Recipes */}
      {isPremium
        && (<SavedRecipes savedRecipes={filteredRecipes} />)}

      {/* Curated Recipes */}
      {/* <CurratedRecipes /> */}

      {/* Premium Info */}
      {!isPremium && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Crown size={16} className="text-indigo-500" />
            <Text className="font-medium">Premium Features</Text>
          </div>
          <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-6">
            <li>• Transform any recipe page you're viewing</li>
            <li>• Save up to 20 custom flowcharts monthly</li>
            <li>• Access to new features first</li>
          </ul>
        </div>
      )}
    </div>
  );
};
