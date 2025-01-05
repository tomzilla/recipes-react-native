import { Tables } from "@/services/database.types";

export interface TagsState {
  selectedTags: number[];
  availableTags: Tables<'tags'>[];
  isLoading: boolean;
  error: string | null;
}