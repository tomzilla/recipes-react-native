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

import {theme} from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const StepCard = ({ step }: {step: Step}) => {
  return (
    <View style={styles.card}>
      {/* Step Title */}
      <Text style={styles.stepTitle}>
        {step.id.replace(/_/g, ' ').toUpperCase()}
      </Text>

      {/* Ingredients & Inputs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients & Inputs</Text>
        {step.inputs.map((input, index) => (
          <View key={index} style={styles.ingredient}>
            <Text style={styles.ingredientName}>
              {input.name.replace(/_/g, ' ')}
            </Text>
            <Text style={styles.ingredientQuantity}>{input.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Action */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action</Text>
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{step.action.description}</Text>
          {step.action.duration && (
            <Text style={styles.actionDetail}>Duration: {step.action.duration}</Text>
          )}
          {step.action.temperature && (
            <Text style={styles.actionDetail}>Temperature: {step.action.temperature}</Text>
          )}
        </View>
      </View>

      {/* Output & Success Indicators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expected Result</Text>
        <View style={styles.outputContainer}>
          <Text style={styles.outputText}>{step.output.description}</Text>
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

const RecipeComponent = ({recipe}: {recipe: Recipe}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent> ) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.stepIndicator}>
          Step {currentStep + 1} of {recipe.json?.steps.length}
        </Text>
      </View>

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

      <Navigation 
        currentStep={currentStep}
        totalSteps={recipe.json?.steps.length}
        onNavigate={handleNavigation}
        scrollX={scrollX}
      />
    </View>
  );
};

// Color palette

const colors = theme.light;
const styles = StyleSheet.create({
  webNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.wine,
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.brand,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.wine,
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  ingredientQuantity: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
  actionContainer: {
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
  },
  actionText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  actionDetail: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  outputContainer: {
    backgroundColor: colors.sage + '15', // Adding transparency
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.sage,
  },
  outputText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  indicatorsContainer: {
    marginTop: 8,
    borderRadius: 6,
    padding: 8,
  },
  indicatorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.wine,
  },
  indicator: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    marginVertical: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.brand,
  },
});

export default RecipeComponent;