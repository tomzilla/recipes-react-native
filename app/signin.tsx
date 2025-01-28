import { StyleSheet, View } from "react-native";
import {LoginComponent} from "@/components/SignIn";
import { useAuth } from "@/hooks/useAuth";
import { router, useLocalSearchParams } from "expo-router";

export default function SignInEmail() {
  const auth = useAuth();
  const params = useLocalSearchParams();
    return (
    <View style={styles.container}>
      <LoginComponent
       />
    </View>);
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
    },
  })