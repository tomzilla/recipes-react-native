import { theme } from "@/constants/Colors";
import { Recipe } from "@/types/recipe";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AddToGroceryListModal } from "./AddToGroceryListModal";
import { useGroceryItems } from "@/hooks/useGroceryItems";

interface GroceryListButtonProps {
  recipe: Recipe;
}

export default function GroceryListButton({ recipe }: GroceryListButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const auth = useAuth();
  if (!auth?.user?.id) {
    return null;
  }
  const {fetchItems} = useGroceryItems(auth?.user?.id);

  return (
    <View>
      <View style={[styles.floatingButton, { bottom: 96 }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome size={28} name="shopping-cart" color={theme.light.secondary} />
        </TouchableOpacity>
      </View>

      <AddToGroceryListModal
        recipe={recipe}
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          fetchItems();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 32,
    zIndex: 1,
    borderRadius: 30,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  }
});