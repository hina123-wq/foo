import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Droplets, Activity, TrendingUp, Save } from 'lucide-react';
import { getUserGoals, upsertUserGoals } from '../services/trackingApi';
import { UserGoals } from '../types/tracking';

const Goals: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<UserGoals>>({});

  const { data: userGoals, isLoading } = useQuery({
    queryKey: ['userGoals'],
    queryFn: getUserGoals,
  });

  const updateGoalsMutation = useMutation({
    mutationFn: upsertUserGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });

  React.useEffect(() => {
    if (userGoals) {
      setFormData(userGoals);
    } else {
      // Set default values
      setFormData({
        daily_calorie_target: 2000,
        water_target_ml: 2000,
        protein_target_g: 150,
        carbs_target_g: 250,
        fat_target_g: 65,
        preferred_diet_type: '',
      });
    }
  }, [userGoals]);

  const handleInputChange = (field: keyof UserGoals, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoalsMutation.mutate(formData);
  };

  const dietOptions = [
    { value: '', label: 'No specific diet' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Ketogenic' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'high_protein', label: 'High Protein' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-300 rounded-lg"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Goals</h1>
        <p className="text-gray-600">Set your daily nutrition and health targets</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calorie Goals */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Daily Calorie Target
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories per day
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="50"
                  value={formData.daily_calorie_target || 2000}
                  onChange={(e) => handleInputChange('daily_calorie_target', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1200</span>
                  <span className="font-medium text-orange-600">
                    {formData.daily_calorie_target || 2000} kcal
                  </span>
                  <span>4000</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Recommended ranges:</p>
              <ul className="space-y-1">
                <li>• Sedentary women: 1,600-2,000 kcal</li>
                <li>• Active women: 2,000-2,400 kcal</li>
                <li>• Sedentary men: 2,000-2,600 kcal</li>
                <li>• Active men: 2,400-3,000 kcal</li>
              </ul>
            </div>
          </motion.div>

          {/* Water Goals */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-500" />
              Daily Water Target
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water intake (ml)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="4000"
                  step="250"
                  value={formData.water_target_ml || 2000}
                  onChange={(e) => handleInputChange('water_target_ml', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1L</span>
                  <span className="font-medium text-blue-600">
                    {((formData.water_target_ml || 2000) / 1000).toFixed(1)}L
                    ({Math.round((formData.water_target_ml || 2000) / 250)} glasses)
                  </span>
                  <span>4L</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">General recommendations:</p>
              <ul className="space-y-1">
                <li>• Women: ~2.7L (11 cups) total fluids</li>
                <li>• Men: ~3.7L (15 cups) total fluids</li>
                <li>• Increase with exercise and hot weather</li>
              </ul>
            </div>
          </motion.div>

          {/* Macronutrient Goals */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Macronutrient Targets
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (grams)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={formData.protein_target_g || 150}
                  onChange={(e) => handleInputChange('protein_target_g', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 0.8-2.2g per kg body weight
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbohydrates (grams)
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={formData.carbs_target_g || 250}
                  onChange={(e) => handleInputChange('carbs_target_g', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 45-65% of total calories
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat (grams)
                </label>
                <input
                  type="number"
                  min="20"
                  max="150"
                  value={formData.fat_target_g || 65}
                  onChange={(e) => handleInputChange('fat_target_g', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 20-35% of total calories
                </p>
              </div>
            </div>
          </motion.div>

          {/* Diet Preferences */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
              Diet Preferences
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Diet Type
              </label>
              <select
                value={formData.preferred_diet_type || ''}
                onChange={(e) => handleInputChange('preferred_diet_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                {dietOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Smart Suggestions</h3>
              <p className="text-sm text-purple-700">
                Based on your diet preference, we'll suggest recipes that match your dietary needs and help you reach your nutrition goals.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            disabled={updateGoalsMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center mx-auto disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {updateGoalsMutation.isPending ? 'Saving...' : 'Save Goals'}
          </button>
          
          {updateGoalsMutation.isSuccess && (
            <p className="text-green-600 mt-2">Goals saved successfully!</p>
          )}
        </motion.div>
      </form>
    </div>
  );
};

export default Goals;