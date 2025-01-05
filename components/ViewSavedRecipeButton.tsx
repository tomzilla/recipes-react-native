import { Tables } from "@/services/database.types";
import { router } from "expo-router";
import { Card } from '@rneui/themed';
import { ArrowRight } from "lucide-react"
import { TouchableOpacity } from "react-native";
function getDomain(url: string) {
  const u = URL.parse(url);
  if (!u) {
    return '';
  }
  return `${u?.protocol}//${u.host}`;
}

interface TaggedRecipe extends Tables<'recipes'> {
  recipe_tags: {
    tag_id: number
  }[]
}

export interface SavedRecipesType {
  recipe: TaggedRecipe
  user_id: string
  state: string
  created_at: any
}

interface ViewSavedRecipeButtonProps {
  recipe: SavedRecipesType
}
export function ViewSavedRecipeButton({ recipe }: ViewSavedRecipeButtonProps) {
  return (
    <TouchableOpacity onPress={() => {
      router.push(`/home/recipes/${recipe.recipe.id}`);
    }}>
      <Card key={recipe.recipe.id}>
        <div className="flex">
          <div className="grow">
            <p className="text-sm font-medium">{recipe.recipe.title}</p>
            <p className="text-xs text-gray-500">{getDomain(recipe.recipe.url)}</p>
            <p className="text-xs text-gray-500">{recipe.recipe.created_at && new Date(recipe.recipe.created_at).toDateString()}</p>
          </div>
          <div className='row-0 flex items-center' >
            <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </Card>
    </TouchableOpacity>
  );
}
