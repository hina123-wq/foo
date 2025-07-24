import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Salad, Clock, Users } from 'lucide-react';
import { getMealPlanForDay } from '../services/api';

const dietOptions = [
  'None', 'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
];

const DietPlanner: React.FC = () => {
  const [calories, setCalories] = useState<number>(2000);
  const [diet, setDiet] = useState<string>('');
  const [exclude, setExclude] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);

  const { data: mealPlan, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['mealPlan', calories, diet, exclude],
    queryFn: () => getMealPlanForDay(calories, diet === 'None' ? undefined : diet, exclude),
    enabled: !showForm,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    refetch();
  };

  const createNewPlan = () => {
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Diet Planner</h1>
        <p className="text-gray-600">Create a custom meal plan based on your dietary preferences and calorie goals.</p>
      </div>

      {showForm ? (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calorie Target
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="calories"
                  min="1000"
                  max="4000"
                  step="100"
                  value={calories}
                  onChange={(e) => setCalories(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 text-lg font-medium text-gray-700 min-w-[70px]">
                  {calories} kcal
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-2">
                Diet Type
              </label>
              <select
                id="diet"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                {dietOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label htmlFor="exclude" className="block text-sm font-medium text-gray-700 mb-2">
                Exclude Ingredients (optional)
              </label>
              <input
                type="text"
                id="exclude"
                placeholder="e.g. shellfish, olives, mushrooms"
                value={exclude}
                onChange={(e) => setExclude(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-sm text-gray-500">Separate multiple ingredients with commas</p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Generate Meal Plan
            </button>
          </form>
        </motion.div>
      ) : (
        <div>
          {isLoading || isRefetching ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4">
                    <div className="h-40 w-40 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-10 bg-gray-300 rounded"></div>
            </div>
          ) : mealPlan ? (
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your {diet || 'Custom'} Meal Plan</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {mealPlan.nutrients.calories.toFixed(0)} kcal
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {mealPlan.nutrients.protein.toFixed(0)}g protein
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    {mealPlan.nutrients.fat.toFixed(0)}g fat
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                    {mealPlan.nutrients.carbohydrates.toFixed(0)}g carbs
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {mealPlan.meals.map((meal, index) => (
                  <motion.div 
                    key={meal.id}
                    className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img 
                      src={`https://spoonacular.com/recipeImages/${meal.id}-556x370.${meal.imageType}`} 
                      alt={meal.title} 
                      className="w-full md:w-40 h-40 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{meal.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{meal.readyInMinutes} min</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{meal.servings} servings</span>
                        </div>
                        <div className="flex items-center">
                          <Salad className="w-4 h-4 mr-1" />
                          <span>Meal {index + 1}</span>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Link
                          to={`/recipes/${meal.id}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={createNewPlan}
                className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Meal Plan
              </button>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto text-center">
              <p className="text-gray-600 mb-4">There was an error generating your meal plan. Please try again.</p>
              <button
                onClick={createNewPlan}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DietPlanner;