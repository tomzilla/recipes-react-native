import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchTags,
  setSelectedTags,
  toggleTag,
  clearSelectedTags,
} from '@/store/tagsSlice';

export const useTags = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedTags,
    availableTags,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.tags);

  return {
    selectedTags,
    availableTags,
    isLoading,
    error,
    fetchTags: () => dispatch(fetchTags()),
    setSelectedTags: (tags: number[]) => dispatch(setSelectedTags(tags)),
    toggleTag: (tagId: number) => dispatch(toggleTag(tagId)),
    clearSelectedTags: () => dispatch(clearSelectedTags()),
  };
};