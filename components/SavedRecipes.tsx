import { Gift } from 'lucide-react';
import { Card } from '@rneui/themed';
import { ViewSavedRecipeButton } from './ViewSavedRecipeButton';
import { Tables } from '@/services/database.types';


export interface SavedRecipesType {
    recipe: Tables<'recipes'>
    user_id: string
    state: string
    created_at: any
  }
  
interface SavedRecipesProps {
    savedRecipes: SavedRecipesType[]
}

function getDomain(url: string) {
    const u = URL.parse(url);
    if (!u) {
        return '';
    }
    return `${u?.protocol}//${u.host}`;
}

export function SavedRecipes({savedRecipes}: SavedRecipesProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 mb-3">
            <Gift size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold">Your Saved Recipes</h2>
            </div>
            
            <div className="space-y-2">
            {savedRecipes.map(recipe => (
                <Card key={recipe.recipe.id}>
                    <div className="space-y-2">
                    <div>
                        <p className="text-sm font-medium">{recipe.recipe.title}</p>
                        <p className="text-xs text-gray-500">{getDomain(recipe.recipe.url)}</p>
                        <p className="text-xs text-gray-500">{new Date(recipe.created_at).toDateString()}</p>
                    </div>
                    <ViewSavedRecipeButton recipe={recipe.recipe} />
                    </div>
                </Card>
            ))}
            </div>
        </div>
    );
}