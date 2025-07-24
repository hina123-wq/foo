import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavoriteStore } from '../store/favoriteStore';
import RecipeCardGrid from '../components/recipe/RecipeCardGrid';
import { getRecipeById } from '../services/api';

const Favorites: React.FC = () => {
  const { favorites } = useFavoriteStore();

  // Fetch all favorite recipes
  const { data: favoriteRecipes, isLoading } = useQuery({
    queryKey: ['favoriteRecipes', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      
      // Fetch each recipe in parallel
      const recipePromises = favorites.map(id => getRecipeById(id.toString()));
      return Promise.all(recipePromises);
    },
    enabled: favorites.length > 0,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Favorite Recipes</h1>
        <p className="text-gray-600">All your saved recipes in one place.</p>
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">
            Save your favorite recipes by clicking the heart icon on any recipe.
          </p>
        </motion.div>
      ) : (
        <RecipeCardGrid recipes={favoriteRecipes || []} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Favorites;