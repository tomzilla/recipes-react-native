import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  color?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  color,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color },
        style,
        { fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
      ]}
      {...rest}
    />
  );
}