import { TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColors } from "@/hooks/useColors";
import { NewColorMode } from "@/constants/NewColors";
import { StyleSheet } from "nativewind";
import {ComponentProps} from "react";


export interface PrimaryButtonProps extends Omit<ComponentProps<typeof TouchableOpacity>, 'style'> {
  text?: string;
}

export function PrimaryButton(props: PrimaryButtonProps) {
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
      backgroundColor: colors.brand,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 50,
    },
    buttonText: {
      color: colors.white,
      textAlign: 'center',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
    }
  });
}