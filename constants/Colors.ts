/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// theme.ts

interface ColorMode {
  brand: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  backgroundAlt: string;
  sage: string;
  butter: string;
  wine: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  success: string;
  overlay: string;
}

interface Theme {
  light: ColorMode;
  dark: ColorMode;
}

export const theme: Theme = {
  light: {
    // Primary colors
    brand: '#D64D57',     // Rich raspberry red
    secondary: '#FF9566', // Warm coral
    
    // Text colors
    textPrimary: '#2D3034',  // Soft black
    textSecondary: '#666666', // Medium grey for secondary text
    
    // Background colors
    background: '#FFFFFF',   // Clean white
    backgroundAlt: '#FFF8F0', // Cream
    
    // Accent colors
    sage: '#7FB685',    // Fresh green
    butter: '#FFE5AD',  // Warm yellow
    wine: '#933F4C',    // Deep wine
    
    // UI colors
    surface: '#FFFFFF',     // Card background
    surfaceAlt: '#F8F8F8',  // Alternative surface
    border: '#E8E9EB',      // Soft grey
    success: '#7FB685',     // Same as sage
    overlay: 'rgba(0, 0, 0, 0.05)', // Light overlay
  },
  
  dark: {
    // Primary colors - slightly muted for dark mode
    brand: '#FF6B74',     // Lighter raspberry
    secondary: '#FF9F75', // Lighter coral
    
    // Text colors
    textPrimary: '#F5F5F5',  // Off-white
    textSecondary: '#B0B0B0', // Light grey for secondary text
    
    // Background colors
    background: '#1A1A1A',    // Soft black
    backgroundAlt: '#2D2D2D', // Slightly lighter than background
    
    // Accent colors - slightly brightened for dark mode
    sage: '#8FC795',      // Lighter sage
    butter: '#FFE5AD',    // Kept same butter
    wine: '#B54D5C',      // Lighter wine
    
    // UI colors
    surface: '#2D2D2D',     // Card background
    surfaceAlt: '#363636',  // Alternative surface
    border: '#404040',      // Dark grey
    success: '#8FC795',     // Same as sage
    overlay: 'rgba(255, 255, 255, 0.05)', // Dark overlay
  }
};
