import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Clock, Users, ChefHat, Heart, ShoppingBag, 
  ArrowLeft, Flame, Weight, Leaf, BarChart3, Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUnifiedRecipeById } from '../services/unifiedApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { useShoppingListStore } from '../store/shoppingListStore';
import { getRecipeRating, rateRecipe, addMealEntry } from '../services/trackingApi';
import { UnifiedRecipe } from '../types/mealDb';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [rating, setRating] = useState(0);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { addItems } = useShoppingListStore();
  
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getUnifiedRecipeById(id!),
    enabled: !!id,
  });
  
  const { data: recipeRating } = useQuery({
    queryKey: ['recipeRating', id],
    queryFn: () => getRecipeRating(id!),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const rateMutation = useMutation({
    mutationFn: ({ rating, isFavorite }: { rating: number; isFavorite: boolean }) =>
      rateRecipe(id!, rating, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeRating', id] });
    },
  });

  const logMealMutation = useMutation({
    mutationFn: addMealEntry,
    onSuccess: () => {
      setShowMealLogger(false);
      alert('Meal logged successfully!');
    },
  });

  React.useEffect(() => {
    if (recipeRating) {
      setRating(recipeRating.rating);
    }
  }, [recipeRating]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
          </div>
          <div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe not found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the recipe you're looking for.</p>
        <button 
          onClick={() => navigate('/recipes')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Browse Recipes
        </button>
      </div>
    );
  }
  
  const favorite = isFavorite(parseInt(recipe.id));
  
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(parseInt(recipe.id));
    } else {
      addFavorite(parseInt(recipe.id));
    }
  };
  
  const addIngredientsToShoppingList = () => {
    if (!recipe.ingredients) return;
    
    const shoppingItems = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      amount: parseFloat(ingredient.amount || '1'),
      unit: ingredient.unit || '',
      recipeId: parseInt(recipe.id),
      recipeTitle: recipe.title
    }));
    
    addItems(shoppingItems);
    // Show confirmation toast or modal here
    alert('Ingredients added to your shopping list!');
  };
  
  const handleRating = (newRating: number) => {
    setRating(newRating);
    rateMutation.mutate({
      rating: newRating,
      isFavorite: recipeRating?.is_favorite || false
    });
  };

  const handleLogMeal = () => {
    if (!recipe) return;
    
    logMealMutation.mutate({
      date: new Date().toISOString().split('T')[0],
      meal_type: selectedMealType,
      recipe_id: recipe.id,
      recipe_title: recipe.title,
      quantity: 1,
      calories: Math.round(recipe.nutrition?.calories || 0),
      protein: Math.round(recipe.nutrition?.protein || 0),
      carbs: Math.round(recipe.nutrition?.carbs || 0),
      fat: Math.round(recipe.nutrition?.fat || 0),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative h-64 md:h-96">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{recipe.readyInMinutes || 'N/A'} min</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{recipe.servings || 'N/A'} servings</span>
              </div>
              {recipe.cuisine && (
                <div className="flex items-center">
                  <ChefHat className="w-4 h-4 mr-1" />
                  <span>{recipe.cuisine}</span>
                </div>
              )}
              {recipe.nutrition && (
                <div className="flex items-center">
                  <Flame className="w-4 h-4 mr-1" />
                  <span>{Math.round(recipe.nutrition.calories)} cal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rate:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`text-xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>

        <button 
          onClick={toggleFavorite}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            favorite 
              ? 'bg-red-100 text-red-500' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-5 h-5 mr-2 ${favorite ? 'fill-red-500' : ''}`} />
          {favorite ? 'Saved' : 'Save Recipe'}
        </button>
        
        <button 
          onClick={addIngredientsToShoppingList}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Shopping List
        </button>
        
        <button 
          onClick={() => setShowMealLogger(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Utensils className="w-5 h-5 mr-2" />
          Log as Meal
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'ingredients' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'instructions' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'nutrition' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nutrition
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'ingredients' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ingredients {recipe.servings ? `for ${recipe.servings} servings` : ''}</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients?.map((ingredient, index: number) => (
                      <motion.li 
                        key={index}
                        className="flex items-start py-2 border-b border-gray-100 last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 text-orange-500">
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                          <span className="ml-2">{ingredient.name}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'instructions' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  {recipe.instructions ? (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: recipe.instructions.replace(/\n/g, '<br>') }} />
                    </div>
                  ) : (
                    <p className="text-gray-600">No detailed instructions available.</p>
                  )}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
                  {recipe.nutrition ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Flame className="w-5 h-5 text-orange-500 mr-2" />
                            <span className="font-semibold text-gray-800">Calories</span>
                          </div>
                          <span className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.calories)}</span>
                          <span className="text-gray-600 ml-1">kcal</span>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Weight className="w-5 h-5 text-green-500 mr-2" />
                            <span className="font-semibold text-gray-800">Protein</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">{Math.round(recipe.nutrition.protein)}</span>
                          <span className="text-gray-600 ml-1">g</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                            <span className="font-semibold text-gray-800">Carbohydrates</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">{Math.round(recipe.nutrition.carbs)}</span>
                          <span className="text-gray-600 ml-1">g</span>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Leaf className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="font-semibold text-gray-800">Fat</span>
                          </div>
                          <span className="text-2xl font-bold text-purple-600">{Math.round(recipe.nutrition.fat)}</span>
                          <span className="text-gray-600 ml-1">g</span>
                        </div>
                      </div>
                      
                      {/* Additional nutrition info */}
                      <div className="md:col-span-2 mt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Additional Nutrition Facts</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-800">{Math.round(recipe.nutrition.fiber)}g</div>
                            <div className="text-sm text-gray-600">Fiber</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-800">{Math.round(recipe.nutrition.sugar)}g</div>
                            <div className="text-sm text-gray-600">Sugar</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-800">{Math.round(recipe.nutrition.sodium)}mg</div>
                            <div className="text-sm text-gray-600">Sodium</div>
                          </div>
                          {recipe.pricePerServing && (
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-gray-800">${(recipe.pricePerServing / 100).toFixed(2)}</div>
                              <div className="text-sm text-gray-600">Per Serving</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Nutrition information not available for this recipe.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          {/* Recipe Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recipe Info</h2>
            
            <div className="space-y-4">
              {recipe.healthScore && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Health Score</h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${recipe.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{recipe.healthScore}/100</span>
                  </div>
                </div>
              )}
              
              {recipe.category && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                </div>
              )}
              
              {recipe.tags && recipe.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Dietary Info</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.vegan && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Vegan
                    </span>
                  )}
                  {recipe.vegetarian && !recipe.vegan && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Vegetarian
                    </span>
                  )}
                  {recipe.glutenFree && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Gluten Free
                    </span>
                  )}
                  {recipe.dairyFree && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Dairy Free
                    </span>
                  )}
                  {recipe.veryHealthy && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Very Healthy
                    </span>
                  )}
                  {recipe.cheap && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Budget Friendly
                    </span>
                  )}
                  {recipe.sustainable && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Sustainable
                    </span>
                  )}
                </div>
              </div>
              
              {recipe.source && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">Source:</span>
                  <span className="text-orange-500 capitalize">
                    {recipe.source}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Source Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Source</h2>
            {recipe.sourceUrl && (
              <a 
                href={recipe.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 transition-colors break-words"
              >
                Original Recipe
              </a>
            )}
            {recipe.youtubeUrl && (
              <div className="mt-4">
                <a 
                  href={recipe.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-600 transition-colors break-words"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Logger Modal */}
      {showMealLogger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Log Meal</h3>
            <p className="text-gray-600 mb-4">Add "{recipe?.title}" to your meal log</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMealLogger(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogMeal}
                disabled={logMealMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {logMealMutation.isPending ? 'Logging...' : 'Log Meal'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;