import React from 'react';
import RecipeCard from './RecipeCard';
import { UnifiedRecipe } from '../../types/mealDb';

interface RecipeCardGridProps {
  recipes: UnifiedRecipe[];
  isLoading?: boolean;
}

const RecipeCardGrid: React.FC<RecipeCardGridProps> = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse"
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-16 bg-gray-300 rounded mb-3"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No recipes found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  );
};

export default RecipeCardGrid;