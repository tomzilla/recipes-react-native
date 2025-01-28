/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// theme.ts

export interface NewColorMode {
  brand: string;
  white: string;
  black: string;
  textDarkGray: string;
  textDarkerGray: string;
  textLightGray: string;
  yellow: string;
  disabled: string;
  inactive: string;
}

export interface Theme {
  light: NewColorMode;
  // dark: NewColorMode;
}

export const theme: Theme = {
  light: {
    brand: '#FF642F',
    white: '#FFFFFF',
    black: '#000000',
    textDarkerGray: '#242426',
    textDarkGray: '#333333',
    textLightGray: '#555555',
    yellow: '#F5CB58',
    inactive: '#E1DEDB',
    disabled: '#F0F0F0',
  },
};
