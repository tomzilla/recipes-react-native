import { theme } from "@/constants/Colors";
import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "react-native";
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Checkbox } from '@/vendor/components/ui/checkbox';
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { useGroceryItems } from "@/hooks/useGroceryItems";
import { GroceryItem } from "@/types/grocery";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function GroceryListManager() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  if (!auth?.user?.id) {
    return null;
  }

  const {
    items,
    loading,
    error,
    fetchItems,
    toggleItem,
    deleteItem,
    clearCheckedConfirmation,
    clearAllConfirmation,
    clearAllListeners,
    clearCheckedGroceryItems,
    clearAllGroceryItems,
    setClearAllConfirmation,
    setClearCheckedConfirmation,
  } = useGroceryItems(auth?.user?.id);

  const clearCheckedTimerRef = useRef<NodeJS.Timeout>();
  const clearAllTimerRef = useRef<NodeJS.Timeout>();
  const swipeableRefs = useRef<{ [key: string]: SwipeableMethods | null }>({});

  useEffect(() => {
    if (auth?.user?.id) {
      fetchItems();
    }
    
    return () => {
      if (clearCheckedTimerRef.current) {
        clearTimeout(clearCheckedTimerRef.current);
      }
      if (clearAllTimerRef.current) {
        clearTimeout(clearAllTimerRef.current);
      }
    };
  }, [dispatch, auth?.user?.id]);

  const handleToggleItem = async (item: GroceryItem) => {
    toggleItem(item);
  };

  const handleDeleteItem = (item: GroceryItem) => {
    deleteItem(item.id);
    swipeableRefs.current[item.id]?.close();
  };

  const renderRightActions = (item: GroceryItem) => {
    return (
      <TouchableOpacity
        style={[styles.deleteAction, { backgroundColor: colors.wine }]}
        onPress={() => handleDeleteItem(item)}
      >
        <FontAwesome name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderGroceryItem = (item: GroceryItem) => (
    <Swipeable
      ref={ref => swipeableRefs.current[item.id] = ref}
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
      key={item.id}
    >
      <TouchableOpacity
        style={[styles.itemRow, { backgroundColor: colors.surface }]}
        onPress={() => handleToggleItem(item)}
      >
        <Checkbox 
          checked={item.checked}
          onCheckedChange={() => handleToggleItem(item)}
        />
        <View style={styles.itemInfo}>
          <Text 
            style={[
              styles.itemName, 
              { color: colors.textPrimary },
              item.checked && styles.checkedItemText
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );


  const handleClearAll = async () => {
    if (!clearAllConfirmation) {
      setClearAllConfirmation(true);
      clearAllTimerRef.current = setTimeout(() => {
        setClearAllConfirmation(false);
      }, 3000);
      return;
    }
    clearAllGroceryItems();
  };

  const handleClearChecked = async () => {
    if (!clearCheckedConfirmation) {
      setClearCheckedConfirmation(true);
      clearCheckedTimerRef.current = setTimeout(() => {
        setClearCheckedConfirmation(false);
      }, 3000);
      return;
    }

    clearCheckedGroceryItems();
  };


  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {items.length > 0 && (
          <TouchableOpacity
            style={[styles.clearAllButton,
              { backgroundColor: clearAllConfirmation ? colors.sage : colors.secondary }
            ]}
            onPress={handleClearAll}
          >
            <FontAwesome name="trash" size={16} color={colors.surface} />
            <Text style={[styles.clearAllText, { color: colors.surface }]}>
              { clearAllConfirmation ? "Tap again to clear" : "Clear All Items" }
            </Text>
          </TouchableOpacity>
        )}

        <ScrollView>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              To Buy ({uncheckedItems.length})
            </Text>
            {uncheckedItems.map(renderGroceryItem)}
            {uncheckedItems.length === 0 && (
              <Text style={[styles.emptyNote, { color: colors.textSecondary }]}>
                No items to buy
              </Text>
            )}
          </View>

          {checkedItems.length > 0 && (
            <View style={[styles.section, styles.checkedSection]}>
              <View style={styles.checkedHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  In Cart ({checkedItems.length})
                </Text>
                <TouchableOpacity
                  style={[
                    styles.clearCheckedButton,
                    { backgroundColor: clearCheckedConfirmation ? colors.sage : colors.secondary }
                  ]}
                  onPress={handleClearChecked}
                >
                  <Text style={[styles.clearCheckedText, { color: colors.surface }]}>
                    {clearCheckedConfirmation ? "Tap again to clear" : "Clear"}
                  </Text>
                </TouchableOpacity>
              </View>
              {checkedItems.map(renderGroceryItem)}
            </View>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  clearAllText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  checkedSection: {
    opacity: 0.8,
  },
  checkedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearCheckedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearCheckedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkedItemText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  recipeNote: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyNote: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});