import { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
}