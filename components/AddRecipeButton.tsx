import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, useWindowDimensions, useColorScheme } from 'react-native';
import { Href, router } from 'expo-router';
import { Camera, Globe, Type } from 'lucide-react-native';
import { theme } from '../constants/Colors';
import { Text } from '@rneui/themed';
import { useAuth } from '@/hooks/useAuth';



const AddRecipeButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme ?? 'light'];
  const { width: screenWidth } = useWindowDimensions();
  const auth = useAuth();

  const handleOptionPress = (route: Href) => {
    setModalVisible(false);
    router.push(route);
  };


  const styles = StyleSheet.create({
    tabButton: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: colors.brand,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -30,
      shadowColor: colors.textPrimary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    plusButton: {
      width: 20,
      height: 20,
      position: 'relative',
    },
    plusHorizontal: {
      position: 'absolute',
      width: 20,
      height: 3,
      backgroundColor: colors.background,
      top: 8.5,
    },
    plusVertical: {
      position: 'absolute',
      width: 3,
      height: 20,
      backgroundColor: colors.background,
      left: 8.5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30, // Extra padding for labels
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: screenWidth,
    },
    option: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: colors.surfaceAlt,
      width: screenWidth / 4,
      height: screenWidth / 4,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.textPrimary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      marginBottom: 8, // Space between button and label
    },
    optionLabel: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      marginTop: 4,
      textAlign: 'center',
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.plusButton}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionPress('/home/recipes/add_camera')}
            >
              <Camera size={32} color={colors.textPrimary} />
              <Text style={styles.optionLabel}>Camera</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionPress('/home/recipes/add_url')}
            >
              <Globe size={32} color={colors.textPrimary} />
              <Text style={styles.optionLabel}>Website</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionPress('/home/recipes/add_text')}
            >
              <Type size={32} color={colors.textPrimary} />
              <Text style={styles.optionLabel}>Text</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AddRecipeButton;