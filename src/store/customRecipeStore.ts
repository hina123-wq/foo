import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomRecipe } from '../types/recipe';
import { v4 as uuidv4 } from 'uuid';

interface CustomRecipeState {
  recipes: CustomRecipe[];
  addRecipe: (recipe: Omit<CustomRecipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<CustomRecipe>) => void;
  removeRecipe: (id: string) => void;
  getRecipeById: (id: string) => CustomRecipe | undefined;
}

export const useCustomRecipeStore = create<CustomRecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],
      
      addRecipe: (recipe) => {
        set((state) => ({
          recipes: [...state.recipes, { ...recipe, id: uuidv4() }],
        }));
      },
      
      updateRecipe: (id, updates) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id ? { ...recipe, ...updates } : recipe
          ),
        }));
      },
      
      removeRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      
      getRecipeById: (id) => {
        return get().recipes.find((recipe) => recipe.id === id);
      },
    }),
    {
      name: 'custom-recipes',
    }
  )
);