import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Droplets,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Minus,
  Scale,
  Utensils,
  Award,
  Clock,
  Edit
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getMealEntries, addMealEntry } from '../services/trackingApi';

const Dashboard: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState(250); // ml
  const [weightInput, setWeightInput] = useState('');
  const [showManualMealLogger, setShowManualMealLogger] = useState(false);
  const [manualMealData, setManualMealData] = useState({
    recipe_title: '',
    meal_type: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: 1
  });
  const queryClient = useQueryClient();

  // Simple data fetching with error handling
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            userGoals: null,
            dailyLog: null,
            todaysMeals: [],
            recentWeight: [],
            waterLogs: []
          };
        }

        // Try to fetch data, but handle errors gracefully
        const today = new Date().toISOString().split('T')[0];
        
        const [userGoalsResult, dailyLogResult, todaysMealsResult] = await Promise.allSettled([
          supabase.from('user_goals').select('*').eq('user_id', user.id).single(),
          supabase.from('daily_logs').select('*').eq('user_id', user.id).eq('date', today).single(),
          getMealEntries(today)
        ]);

        return {
          userGoals: userGoalsResult.status === 'fulfilled' ? userGoalsResult.value.data : null,
          dailyLog: dailyLogResult.status === 'fulfilled' ? dailyLogResult.value.data : null,
          todaysMeals: todaysMealsResult.status === 'fulfilled' ? todaysMealsResult.value : [],
          recentWeight: [],
          waterLogs: []
        };
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return {
          userGoals: null,
          dailyLog: null,
          todaysMeals: [],
          recentWeight: [],
          waterLogs: []
        };
      }
    },
  });

  const addWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('water_logs')
        .insert({
          user_id: user.id,
          amount_ml: amount,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });

  const addWeightMutation = useMutation({
    mutationFn: async (weight: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weight_logs')
        .upsert({
          user_id: user.id,
          weight_kg: weight,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      setWeightInput('');
    },
  });

  const addManualMealMutation = useMutation({
    mutationFn: addMealEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      setShowManualMealLogger(false);
      setManualMealData({
        recipe_title: '',
        meal_type: 'lunch',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: 1
      });
    },
  });
  const handleAddWater = () => {
    addWaterMutation.mutate(waterAmount);
  };

  const handleAddWeight = () => {
    const weight = parseFloat(weightInput);
    if (weight > 0) {
      addWeightMutation.mutate(weight);
    }
  };

  const handleManualMealSubmit = () => {
    if (!manualMealData.recipe_title.trim()) {
      alert('Please enter a meal name');
      return;
    }
    
    addManualMealMutation.mutate({
      date: new Date().toISOString().split('T')[0],
      meal_type: manualMealData.meal_type,
      recipe_id: `manual-${Date.now()}`,
      recipe_title: manualMealData.recipe_title,
      quantity: manualMealData.quantity,
      calories: Math.round(manualMealData.calories * manualMealData.quantity),
      protein: Math.round(manualMealData.protein * manualMealData.quantity),
      carbs: Math.round(manualMealData.carbs * manualMealData.quantity),
      fat: Math.round(manualMealData.fat * manualMealData.quantity),
    });
  };
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Dashboard Error</h2>
          <p className="text-red-600">There was an error loading your dashboard. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Loading your nutrition tracking data...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-300 rounded-lg"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const { userGoals, dailyLog, todaysMeals, recentWeight, waterLogs } = dashboardData || {};

  // Calculate progress data with defaults
  const calorieProgress = {
    current: dailyLog?.total_calories || 0,
    target: userGoals?.daily_calorie_target || 2000,
    percentage: Math.min(((dailyLog?.total_calories || 0) / (userGoals?.daily_calorie_target || 2000)) * 100, 100)
  };

  const waterProgress = {
    current: dailyLog?.water_intake_ml || 0,
    target: userGoals?.water_target_ml || 2000,
    percentage: Math.min(((dailyLog?.water_intake_ml || 0) / (userGoals?.water_target_ml || 2000)) * 100, 100),
    glasses: Math.floor((dailyLog?.water_intake_ml || 0) / 250)
  };

  const macroData = {
    protein: dailyLog?.total_protein || 0,
    carbs: dailyLog?.total_carbs || 0,
    fat: dailyLog?.total_fat || 0
  };

  // Group meals by type
  const mealsByType = todaysMeals?.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, typeof todaysMeals>) || {};
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your daily nutrition and health goals</p>
        <p className="text-sm text-gray-500 mt-1">
          Data resets daily at midnight. Today: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Calories Card */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Calories</h3>
                <p className="text-sm text-gray-600">Daily Goal</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{calorieProgress.current} kcal</span>
              <span>{calorieProgress.target} kcal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  calorieProgress.percentage > 100 ? 'bg-red-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(calorieProgress.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {calorieProgress.percentage.toFixed(1)}% of daily goal
          </p>
        </motion.div>

        {/* Water Card */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Droplets className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Water</h3>
                <p className="text-sm text-gray-600">{waterProgress.glasses} glasses</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{waterProgress.current} ml</span>
              <span>{waterProgress.target} ml</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(waterProgress.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setWaterAmount(Math.max(50, waterAmount - 50))}
              className="p-1 bg-gray-100 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm">{waterAmount}ml</span>
            <button
              onClick={() => setWaterAmount(waterAmount + 50)}
              className="p-1 bg-gray-100 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddWater}
              disabled={addWaterMutation.isPending}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {addWaterMutation.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </motion.div>

        {/* Weight Card */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Scale className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Weight</h3>
                <p className="text-sm text-gray-600">
                  {recentWeight && recentWeight[0] ? `${recentWeight[0].weight_kg} kg` : 'No data'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded text-sm"
              step="0.1"
            />
            <button
              onClick={handleAddWeight}
              disabled={!weightInput || addWeightMutation.isPending}
              className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {addWeightMutation.isPending ? 'Logging...' : 'Log'}
            </button>
          </div>
        </motion.div>

        {/* Meals Card */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Utensils className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Meals</h3>
                <p className="text-sm text-gray-600">{todaysMeals?.length || 0} logged today</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {Object.entries(mealsByType).map(([mealType, meals]) => (
              <div key={mealType} className="flex justify-between text-sm">
                <span className="capitalize text-gray-600">{mealType}:</span>
                <span className="font-medium">{meals.length} meal{meals.length !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowManualMealLogger(true)}
            className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Log Manual Meal
          </button>
          <div className="text-center py-4">
            <p className="text-gray-600 text-sm">Start logging meals to see your progress</p>
          </div>
        </motion.div>
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
            Macronutrient Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{macroData.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{macroData.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{macroData.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
          
          {/* Today's Meals List */}
          {todaysMeals && todaysMeals.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Today's Meals</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {todaysMeals.map((meal) => (
                  <div key={meal.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-sm">{meal.recipe_title}</span>
                      <span className="text-xs text-gray-500 ml-2 capitalize">({meal.meal_type})</span>
                    </div>
                    <span className="text-sm text-orange-600 font-medium">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/goals'}
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Set Your Goals
            </button>
            <button 
              onClick={() => window.location.href = '/recipes'}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Find Recipes
            </button>
            <button 
              onClick={() => window.location.href = '/meal-scheduler'}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Plan Meals
            </button>
          </div>
        </motion.div>
      </div>

      {/* Getting Started */}
      {(!userGoals || !dailyLog) && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome to Your Dashboard!</h2>
          <p className="text-blue-600 mb-4">
            Get started by setting your health goals and logging your first meal.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => window.location.href = '/goals'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Set Goals
            </button>
            <button 
              onClick={() => window.location.href = '/recipes'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Browse Recipes
            </button>
          </div>
        </motion.div>
      )}
    </div>
      {/* Manual Meal Logger Modal */}
      {showManualMealLogger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Log Manual Meal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Name*
                </label>
                <input
                  type="text"
                  value={manualMealData.recipe_title}
                  onChange={(e) => setManualMealData({...manualMealData, recipe_title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={manualMealData.meal_type}
                  onChange={(e) => setManualMealData({...manualMealData, meal_type: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={manualMealData.quantity}
                    onChange={(e) => setManualMealData({...manualMealData, quantity: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories (per serving)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualMealData.calories}
                    onChange={(e) => setManualMealData({...manualMealData, calories: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualMealData.protein}
                    onChange={(e) => setManualMealData({...manualMealData, protein: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualMealData.carbs}
                    onChange={(e) => setManualMealData({...manualMealData, carbs: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualMealData.fat}
                    onChange={(e) => setManualMealData({...manualMealData, fat: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              {/* Nutrition Preview */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Total Nutrition (×{manualMealData.quantity})</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{Math.round(manualMealData.calories * manualMealData.quantity)}</div>
                    <div className="text-gray-600">kcal</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{Math.round(manualMealData.protein * manualMealData.quantity)}g</div>
                    <div className="text-gray-600">protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{Math.round(manualMealData.carbs * manualMealData.quantity)}g</div>
                    <div className="text-gray-600">carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-600">{Math.round(manualMealData.fat * manualMealData.quantity)}g</div>
                    <div className="text-gray-600">fat</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowManualMealLogger(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualMealSubmit}
                disabled={addManualMealMutation.isPending || !manualMealData.recipe_title.trim()}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {addManualMealMutation.isPending ? 'Logging...' : 'Log Meal'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
  );
};

export default Dashboard;