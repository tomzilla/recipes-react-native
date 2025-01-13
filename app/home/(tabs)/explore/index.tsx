import { CuratedRecipesView } from "@/components/CuratedRecipesView";
import { router } from "expo-router";
import { View } from "react-native";

export default function Explore() {
    return (<View>
      <CuratedRecipesView onRecipePress={(recipe) => {
        router.navigate(`/home/(tabs)/explore/${recipe.id}`)
      }} />
    </View>);
}