import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Heart, Flame, DollarSign, Leaf, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoriteStore } from '../../store/favoriteStore';
import { UnifiedRecipe } from '../../types/mealDb';

interface RecipeCardProps {
  recipe: UnifiedRecipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const favorite = isFavorite(parseInt(recipe.id));

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(parseInt(recipe.id));
    } else {
      addFavorite(parseInt(recipe.id));
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <motion.div 
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/recipes/${recipe.id}`} className="block h-full">
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-48 object-cover"
          />
          
          {/* Health Score Badge */}
          {recipe.healthScore && recipe.healthScore > 70 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Award className="w-3 h-3 mr-1" />
              {recipe.healthScore}
            </div>
          )}
          
          {/* Price Badge */}
          {recipe.pricePerServing && (
            <div className="absolute top-2 left-2 mt-8 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              {formatPrice(recipe.pricePerServing)}
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow transition-colors hover:bg-opacity-100"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-5 h-5 ${favorite ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">{recipe.title}</h3>
          
          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center text-orange-600">
                  <Flame className="w-3 h-3 mr-1" />
                  <span className="font-medium">{Math.round(recipe.nutrition.calories)} cal</span>
                </div>
                <div className="text-green-600">
                  <span className="font-medium">{Math.round(recipe.nutrition.protein)}g</span> protein
                </div>
                <div className="text-blue-600">
                  <span className="font-medium">{Math.round(recipe.nutrition.carbs)}g</span> carbs
                </div>
                <div className="text-purple-600">
                  <span className="font-medium">{Math.round(recipe.nutrition.fat)}g</span> fat
                </div>
              </div>
            </div>
          )}
          
          {/* Diet Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.vegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                Vegan
              </span>
            )}
            {recipe.vegetarian && !recipe.vegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                Vegetarian
              </span>
            )}
            {recipe.glutenFree && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                GF
              </span>
            )}
            {recipe.dairyFree && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                DF
              </span>
            )}
          </div>
          
          {/* Recipe Meta */}
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.readyInMinutes || 'N/A'} min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{recipe.servings || 'N/A'} servings</span>
            </div>
          </div>
          
          {/* Health Indicators */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-1">
              {recipe.veryHealthy && (
                <span className="text-green-500 text-xs">🥗 Healthy</span>
              )}
              {recipe.cheap && (
                <span className="text-blue-500 text-xs">💰 Budget</span>
              )}
              {recipe.sustainable && (
                <span className="text-green-600 text-xs">🌱 Eco</span>
              )}
            </div>
            
            {recipe.cuisine && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {recipe.cuisine}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;