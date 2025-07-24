import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { searchAllRecipes, getRandomRecipes, filterRecipesByCategory } from '../services/unifiedApi';
import RecipeCardGrid from '../components/recipe/RecipeCardGrid';
import { UnifiedRecipe } from '../types/mealDb';

const dietOptions = [
  'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
];

const Recipes: React.FC = () => {
  const { cuisine } = useParams<{ cuisine?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<string>('');

  // Update search params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (selectedDiet) {
      newParams.set('diet', selectedDiet);
    } else {
      newParams.delete('diet');
    }
    
    if (JSON.stringify([...newParams.entries()]) !== JSON.stringify([...searchParams.entries()])) {
      setSearchParams(newParams);
    }
  }, [selectedDiet, searchParams, setSearchParams]);

  // Fetch recipes based on search or cuisine
  const { data, isLoading } = useQuery({
    queryKey: ['recipes', searchQuery, cuisine, selectedDiet],
    queryFn: async () => {
      // If we have a search query or cuisine, search for recipes
      if (searchQuery || cuisine) {
        if (cuisine) {
          return await filterRecipesByCategory(cuisine, 20);
        } else {
          return await searchAllRecipes(searchQuery, 20);
        }
      }
      
      // Otherwise, fetch random recipes
      return await getRandomRecipes(20);
    },
  });
  
  // Handle filter toggles
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setSelectedDiet('');
  };

  // Handle diet selection
  const handleDietChange = (diet: string) => {
    setSelectedDiet(selectedDiet === diet ? '' : diet);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {cuisine 
            ? `${cuisine} Recipes` 
            : searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : 'All Recipes'}
        </h1>
        <p className="text-gray-600">
          {cuisine 
            ? `Explore delicious ${cuisine} cuisine recipes` 
            : 'Discover recipes from around the world'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={toggleFilters}
            className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            <span>Filters</span>
          </button>
          
          {(selectedDiet) && (
            <button 
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((diet) => (
                <button
                  key={diet}
                  onClick={() => handleDietChange(diet)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDiet === diet
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      <RecipeCardGrid recipes={data || []} isLoading={isLoading} />
    </div>
  );
};

export default Recipes;