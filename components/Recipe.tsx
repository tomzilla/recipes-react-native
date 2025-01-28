import { Recipe, Step } from '@/types/recipe';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,

  Dimensions,
  StyleSheet,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';

import { NewColorMode } from '@/constants/NewColors';
import { useColors } from '@/hooks/useColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const StepCard = ({ step }: { step: Step }) => {
  const styles = getStyles(useColors());

  return (
    <View style={styles.card}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients & Inputs</Text>
        {step.inputs.map((input, index) => (
          <View key={index} style={styles.ingredient}>
            <Text style={styles.ingredientName}>{input.name.replace(/_/g, ' ')}</Text>
            <Text style={styles.ingredientQuantity}>{input.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Action */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action</Text>
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{step.action.name}</Text>
          {step.action.duration ? <Text style={styles.actionDetail}>Duration: {step.action.duration}</Text> : null}
          {step.action.temperature ? (
            <Text style={styles.actionDetail}>Temperature: {step.action.temperature}</Text>
          )  : null}
        </View>
      </View>

      {/* Output & Success Indicators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expected Result</Text>
        <View style={styles.outputContainer}>
          <Text style={styles.outputText}>{step.output.name}</Text>
          {step.output.successIndicators && (
            <View style={styles.indicatorsContainer}>
              <Text style={styles.indicatorsTitle}>Success Indicators:</Text>
              {step.output.successIndicators.map((indicator, index) => (
                <Text key={index} style={styles.indicator}>• {indicator}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Detailed Field */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Explanation</Text>
        <Text style={styles.detailed}>{step.detailed}</Text>
      </View>
    </View>
  );
};


interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onNavigate: (direction: string) => void;
  scrollX: Animated.Value;
}

const Navigation = ({ currentStep, totalSteps, onNavigate, scrollX }: NavigationProps) => {
  const styles = getStyles(useColors());

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.pagination}>
        {Array(totalSteps).fill(0).map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { transform: [{ scale }], opacity },
                currentStep === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.webNavigation}>
      <button
        onClick={() => onNavigate('prev')}
        disabled={currentStep === 0}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <View style={styles.pagination}>
        {Array(totalSteps).fill(0).map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { transform: [{ scale }], opacity },
                currentStep === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>

      <button
        onClick={() => onNavigate('next')}
        disabled={currentStep === totalSteps - 1}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </View>
  );
};

const RecipeComponent = ({ recipe }: { recipe: Recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / SCREEN_WIDTH);
    setCurrentStep(index);
  };

  const handleNavigation = (direction: string) => {
    const nextStep = direction === 'next' ? currentStep + 1 : currentStep - 1;
    if (nextStep >= 0 && nextStep < recipe.json?.steps.length) {
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * SCREEN_WIDTH,
        animated: true,
      });
    }
  };
  const styles = getStyles(useColors());
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
      </View>
      <View style={styles.stepsContainer}>
        <Text style={styles.stepIndicator}>
          Step {currentStep + 1}&nbsp;
        </Text>
        <Text style={styles.totalSteps}>
          of {recipe.json?.steps.length} 
        </Text>
      </View>
      <Navigation
        currentStep={currentStep}
        totalSteps={recipe.json?.steps.length}
        onNavigate={handleNavigation}
        scrollX={scrollX}
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {recipe.json?.steps.map((step, index) => (
          <View key={index} style={styles.slide}>
            <StepCard step={step} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Color palette

const getStyles = (colors: NewColorMode) => StyleSheet.create({
  detailed: {
    fontSize: 14,
    color: colors.textDarkGray,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  webNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDarkerGray,
  },
  totalSteps: {
    fontSize: 16,
    height: 30,
    alignContent:'flex-end',
    color: colors.textDarkerGray,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 32,
    elevation: 3,
  },
  stepsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    lineHeight: 30,
  },
  stepIndicator: {
    fontSize: 22,
    fontWeight: 'bold',
    height: 30,
    color: colors.textDarkerGray,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textDarkerGray,
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  ingredientName: {
    fontSize: 16,
    color: colors.textDarkGray,
    textTransform: 'capitalize',
  },
  ingredientQuantity: {
    fontSize: 16,
    color: colors.textDarkGray,
    fontWeight: '600',
  },
  actionContainer: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
  },
  actionText: {
    fontSize: 16,
    color: colors.textDarkGray,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  actionDetail: {
    fontSize: 14,
    color: colors.textDarkGray,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  outputContainer: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.white,
  },
  outputText: {
    fontSize: 16,
    color: colors.textDarkGray,
    textTransform: 'capitalize',


    marginBottom: 8,
  },
  indicatorsContainer: {
    marginTop: 8,
    borderRadius: 6,
    padding: 8,
  },
  indicatorsTitle: {
    fontSize: 14,
    textTransform: 'capitalize',

    fontWeight: '600',
    marginBottom: 4,
    color: colors.textDarkGray,
  },
  indicator: {
    fontSize: 14,
    color: colors.textDarkGray,
    textTransform: 'capitalize',
    marginLeft: 8,
    marginVertical: 2,
  },
  pagination: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    height: 8,
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.inactive,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.brand,
  },
});

export default RecipeComponent;