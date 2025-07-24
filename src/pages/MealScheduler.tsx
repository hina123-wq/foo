import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMealSchedules, addMealSchedule, deleteMealSchedule } from '../services/trackingApi';
import { getRandomRecipes } from '../services/unifiedApi';
import { MealSchedule } from '../types/tracking';
import { UnifiedRecipe } from '../types/mealDb';

const MealScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const queryClient = useQueryClient();

  const mealTypes = [
    { key: 'breakfast' as const, label: 'Breakfast', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'lunch' as const, label: 'Lunch', color: 'bg-green-100 text-green-800' },
    { key: 'dinner' as const, label: 'Dinner', color: 'bg-blue-100 text-blue-800' },
    { key: 'snack' as const, label: 'Snack', color: 'bg-purple-100 text-purple-800' },
  ];

  // Get week range for current view
  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week (Saturday)
    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = getWeekRange(selectedDate);

  const { data: mealSchedules, isLoading } = useQuery({
    queryKey: ['mealSchedules', weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]],
    queryFn: () => getMealSchedules(
      weekStart.toISOString().split('T')[0],
      weekEnd.toISOString().split('T')[0]
    ),
  });

  const { data: suggestedRecipes } = useQuery({
    queryKey: ['suggestedRecipes'],
    queryFn: () => getRandomRecipes(12),
    enabled: showRecipeSelector,
  });

  const addMealMutation = useMutation({
    mutationFn: addMealSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealSchedules'] });
      setShowRecipeSelector(false);
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMealSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealSchedules'] });
    },
  });

  const handleAddMeal = (recipe: UnifiedRecipe) => {
    addMealMutation.mutate({
      date: selectedDate.toISOString().split('T')[0],
      meal_type: selectedMealType,
      recipe_id: recipe.id,
      recipe_title: recipe.title,
      recipe_image: recipe.image,
      servings: 1,
      calories: recipe.nutrition?.calories || 0,
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    if (window.confirm('Are you sure you want to remove this meal from your schedule?')) {
      deleteMealMutation.mutate(mealId);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  const getDaySchedule = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealSchedules?.filter(meal => meal.date === dateStr) || [];
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meal Scheduler</h1>
        <p className="text-gray-600">Plan your meals for the week ahead</p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateWeek('prev')}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous Week
        </button>
        
        <h2 className="text-xl font-semibold">
          {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
        </h2>
        
        <button
          onClick={() => navigateWeek('next')}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Next Week
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {getWeekDays().map((day, index) => {
          const daySchedule = getDaySchedule(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <motion.div
              key={index}
              className={`bg-white rounded-lg shadow-md p-4 min-h-[300px] ${
                isToday ? 'ring-2 ring-orange-500' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </h3>
                <p className="text-sm text-gray-600">{day.getDate()}</p>
                {isToday && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {mealTypes.map(({ key, label, color }) => {
                  const meals = daySchedule.filter(meal => meal.meal_type === key);
                  
                  return (
                    <div key={key} className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                          {label}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedMealType(key as any);
                            setShowRecipeSelector(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      {meals.map((meal) => (
                        <div
                          key={meal.id}
                          className="bg-gray-50 rounded p-2 text-xs group hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{meal.recipe_title}</span>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                          {meal.calories && (
                            <p className="text-gray-600 mt-1">{meal.calories} kcal</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Add {selectedMealType} for {selectedDate.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setShowRecipeSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {suggestedRecipes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleAddMeal(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        {recipe.readyInMinutes && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recipe.readyInMinutes}m
                          </div>
                        )}
                        {recipe.servings && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {recipe.servings}
                          </div>
                        )}
                      </div>
                      {recipe.nutrition && (
                        <p className="text-sm text-orange-600 mt-2">
                          {Math.round(recipe.nutrition.calories)} kcal
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading recipe suggestions...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MealScheduler;