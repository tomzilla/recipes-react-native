import { useEffect, useState } from 'react';
import { ChefHat, Crown, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { CurratedRecipes } from './CurratedRecipes.tsx';
import { SavedRecipes, SavedRecipesType } from './SavedRecipes.tsx';
import { GenerateButton } from './GenerateButton.tsx';
import { supabase } from '@/services/SupabaseClient.ts';
import { Button } from '@/vendor/components/ui/button.tsx';
import { Card, CardContent } from '@/vendor/components/ui/card.tsx';
import { Tables } from '@/services/database.types.ts';
import { Text } from '@rneui/themed';
import { View } from 'react-native';

interface LoggedInProps {
  user: User | null,
  userProfile: Tables<'user_profiles'> | null,
}
export function LoggedIn({ user, userProfile }: LoggedInProps) {
  if (!user) {
    return null;
  }
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipesType[]>([]);

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

  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }

      const supabaseQuery = supabase.from('saved_recipes').select(`
            recipe:recipes!inner(
                id,
                title,
                url
            ),
            user_id,
            state,
            created_at
            `).limit(1, { referencedTable: 'recipes' }).eq('user_id', user.id).returns<SavedRecipesType[]>();

      const { data, error } = await supabaseQuery;
      console.log(data, error);
      if (error) {
        console.warn("Failed to load saved recipes: ", error)
      } else if (data) {
        setSavedRecipes(data);
      }
    })();
  }, [refresh, user]);

  return (
    <div className="p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <ChefHat className="text-indigo-500" size={24} />
          <h1 className="text-lg font-semibold">Recipe Transformer</h1>
        </div>
        {!isPremium && (
          <Button
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Crown size={16} className="mr-1" />
            <Text>Upgrade $5/mo ({userProfile?.plan})</Text>
          </Button>
        )}
      </div>

      {/* Premium Feature Banner */}
      {!isPremium && (
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
            <Text className="text-xs text-gray-600 mt-2">
              Premium lets you transform any recipe you're viewing into a flowchart
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Premium Section */}
      {isPremium && (
        <Card className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-indigo-500" />
              <Text className="font-medium text-sm">Current Recipe Page</Text>
            </div>
            <GenerateButton
              savedRecipes={savedRecipes}
              onGenerate={() => {
                setRefresh(!refresh);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Saved Recipes */}
      {isPremium
        && (<SavedRecipes savedRecipes={savedRecipes} />)}

      {/* Curated Recipes */}
      <CurratedRecipes />

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
