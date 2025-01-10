import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCuratedRecipes } from '@/store/curatedRecipesSlice';
import { AppDispatch, RootState } from '@/store/store';

export function useCuratedRecipes() {

const {trending, curated, loading, error} = useSelector((state: RootState) => state.curatedRecipes);


  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCuratedRecipes());
  }, [dispatch]);

  return {
    trending,
    curated,
    loading,
    error,
    refresh: () => dispatch(fetchCuratedRecipes())
  };
}