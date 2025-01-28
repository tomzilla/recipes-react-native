import { TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColors } from "@/hooks/useColors";
import { NewColorMode } from "@/constants/NewColors";
import { StyleSheet } from "nativewind";
import {ComponentProps} from "react";


export interface TransparentButtonProps extends Omit<ComponentProps<typeof TouchableOpacity>, 'style'> {
  text?: string;
}

export function TransparentButton(props: TransparentButtonProps) {
  const styles = getStyles(useColors());
  return (
    <TouchableOpacity
      style={[styles.button]}
      {...props}
  >
    <ThemedText style={styles.buttonText}>{props.text}</ThemedText>
  </TouchableOpacity>
  );
}

function getStyles(colors: NewColorMode) {
  return StyleSheet.create({
    button: {
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    buttonText: {
      color: colors.white,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 17,
      lineHeight: 22,
    }
  });
}