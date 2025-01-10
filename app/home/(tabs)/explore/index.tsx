import { CuratedRecipesView } from "@/components/CuratedRecipesView";
import { View } from "react-native";

export default function Explore() {
    return (<View>
      <CuratedRecipesView onRecipePress={() => {
        console.log('pressed');
      }} />
    </View>);
}