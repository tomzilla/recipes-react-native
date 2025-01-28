import { useColorScheme } from "./useColorScheme";
import { theme } from '@/constants/NewColors';
export function useColors() {
  const colorScheme = useColorScheme();
  return theme['light'];
}