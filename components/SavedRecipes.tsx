import { Gift } from 'lucide-react';
import { SavedRecipesType, ViewSavedRecipeButton } from './ViewSavedRecipeButton';

interface SavedRecipesProps {
    savedRecipes: SavedRecipesType[]
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
                <ViewSavedRecipeButton recipe={recipe} />
            ))}
            </div>
        </div>
    );
}