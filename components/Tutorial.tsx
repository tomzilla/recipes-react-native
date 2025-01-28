import { NewColorMode, Theme } from '@/constants/NewColors';
import { useColors } from '@/hooks/useColors';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { PrimaryButton } from './PrimaryButton';
import { TransparentButton } from './ClearButton';

interface TutorialFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    header: 'Never lose a recipe again',
    body: 'Import your favorite recipes from the web, social media, or recipe books',
  },
  {
    header: 'No more messy recipe cards',
    body: 'We analyze the recipe and create easy to follow steps for you',
  },
  {
    header: 'Discover new trending recipes',
    body: 'Get personalized recommendations based on your taste preferences',
  },
]
export const TutorialFlow: React.FC<TutorialFlowProps> = ({ onComplete }) => {

  const colors = useColors();
  const styles = getStyles(colors);

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const ProgressPills = () => (
    <View style={styles.progressContainer}>
      {steps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressPill,
            currentStep === index ? styles.activePill : styles.inactivePill
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tutorialBox}>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.header}>
            {steps[currentStep].header}
          </ThemedText>
          <ThemedText style={styles.body}>
            {steps[currentStep].body}
          </ThemedText>
        </View>
        <ProgressPills />

        <View style={styles.buttonContainer}>
          {currentStep < steps.length - 1 ? (
            <>
              <PrimaryButton
                onPress={handleNext}
                text='Next'
              />
              <TransparentButton
                onPress={handleSkip}
                text='Skip'
              />
            </>
          ) : (
            <PrimaryButton
              onPress={handleNext}
              text='Get Started'
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};


function getStyles(colors: NewColorMode) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tutorialBox: {
      backgroundColor: colors.yellow,
      borderRadius: 32,
      paddingVertical: 24,
      paddingHorizontal: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
      gap: 8,
    },
    progressPill: {
      height: 8,
      width: 20,
      borderRadius: 4,
    },
    activePill: {
      backgroundColor: colors.brand,
    },
    inactivePill: {
      backgroundColor: colors.white,
    },
    contentContainer: {
      marginBottom: 24,
      alignItems: 'center',
    },
    header: {
      color: colors.textDarkerGray,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 16,
      textAlign: 'center',
    },
    body: {
      color: colors.textLightGray,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'stretch',
      gap: 16,
    }
  });
}