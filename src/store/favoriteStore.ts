import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '../types/recipe';

interface FavoriteState {
  favorites: number[];
  addFavorite: (recipeId: number) => void;
  removeFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (recipeId: number) => {
        set((state) => ({
          favorites: [...state.favorites, recipeId],
        }));
      },
      
      removeFavorite: (recipeId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== recipeId),
        }));
      },
      
      isFavorite: (recipeId: number) => {
        return get().favorites.includes(recipeId);
      },
    }),
    {
      name: 'favorite-recipes',
    }
  )
);