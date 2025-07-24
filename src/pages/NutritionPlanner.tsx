import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, BarChart3, Flame, Plus, X } from 'lucide-react';
import { getNutritionForIngredient } from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

interface TrackedItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

const NutritionPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  
  const { data: nutritionData, isLoading, refetch } = useQuery({
    queryKey: ['nutrition', searchQuery],
    queryFn: () => getNutritionForIngredient(searchQuery),
    enabled: false,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetch();
    }
  };
  
  const addToTracked = () => {
    if (!nutritionData) return;
    
    const calories = nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0;
    const protein = nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0;
    const carbs = nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0;
    const fat = nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0;
    
    const newItem: TrackedItem = {
      id: Date.now().toString(),
      name: nutritionData.name,
      calories,
      protein,
      carbs,
      fat,
      amount: 1,
      unit: 'serving',
    };
    
    setTrackedItems([...trackedItems, newItem]);
    setSearchQuery('');
  };
  
  const removeTrackedItem = (id: string) => {
    setTrackedItems(trackedItems.filter(item => item.id !== id));
  };
  
  const updateItemAmount = (id: string, amount: number) => {
    setTrackedItems(
      trackedItems.map(item => 
        item.id === id ? { ...item, amount } : item
      )
    );
  };
  
  // Calculate total nutrition values
  const totalCalories = trackedItems.reduce((sum, item) => sum + (item.calories * item.amount), 0);
  const totalProtein = trackedItems.reduce((sum, item) => sum + (item.protein * item.amount), 0);
  const totalCarbs = trackedItems.reduce((sum, item) => sum + (item.carbs * item.amount), 0);
  const totalFat = trackedItems.reduce((sum, item) => sum + (item.fat * item.amount), 0);
  
  // Data for macronutrient distribution chart
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [totalProtein * 4, totalCarbs * 4, totalFat * 9], // Convert to calories
        backgroundColor: ['#4ade80', '#facc15', '#f87171'],
        borderColor: ['#22c55e', '#eab308', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nutrition Planner</h1>
        <p className="text-gray-600">Track your daily nutrition intake and maintain a balanced diet.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nutrition Search */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-orange-500" />
              Find Food
            </h2>
            <form onSubmit={handleSearch}>
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search for any food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            ) : nutritionData ? (
              <motion.div
                className="border rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-medium text-lg mb-2">{nutritionData.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-medium">
                      {nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0} kcal
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein:</span>
                    <span className="font-medium">
                      {nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs:</span>
                    <span className="font-medium">
                      {nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat:</span>
                    <span className="font-medium">
                      {nutritionData.nutrition?.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0}g
                    </span>
                  </div>
                </div>
                <button
                  onClick={addToTracked}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Daily Tracker
                </button>
              </motion.div>
            ) : searchQuery ? (
              <p className="text-gray-600 text-center py-4">No results found. Try another search term.</p>
            ) : null}
          </div>
          
          {/* Tracked Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tracked Foods</h2>
            
            {trackedItems.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No items added yet. Search for foods to start tracking.
              </p>
            ) : (
              <ul className="space-y-3">
                {trackedItems.map(item => (
                  <motion.li
                    key={item.id}
                    className="border-b pb-3 last:border-0"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{item.name}</span>
                      <button
                        onClick={() => removeTrackedItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 mr-2">Amount:</span>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={item.amount}
                        onChange={(e) => updateItemAmount(item.id, parseFloat(e.target.value))}
                        className="w-16 p-1 text-sm border border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600 ml-1">{item.unit}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round(item.calories * item.amount)} kcal | 
                      P: {(item.protein * item.amount).toFixed(1)}g | 
                      C: {(item.carbs * item.amount).toFixed(1)}g | 
                      F: {(item.fat * item.amount).toFixed(1)}g
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Nutrition Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
              Nutrition Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Flame className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Calories</span>
                </div>
                <div className="text-2xl font-bold">{Math.round(totalCalories)} kcal</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Protein</div>
                <div className="text-2xl font-bold text-green-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-xs text-gray-500">{Math.round(totalProtein * 4)} kcal</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Carbs</div>
                <div className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                <div className="text-xs text-gray-500">{Math.round(totalCarbs * 4)} kcal</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Fat</div>
                <div className="text-2xl font-bold text-red-600">{totalFat.toFixed(1)}g</div>
                <div className="text-xs text-gray-500">{Math.round(totalFat * 9)} kcal</div>
              </div>
            </div>
            
            {trackedItems.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <div className="w-64 h-64 mx-auto">
                    <Doughnut 
                      data={chartData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const value = context.raw as number;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${percentage}% (${Math.round(value)} kcal)`;
                              }
                            }
                          }
                        },
                        cutout: '70%',
                      }}
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="font-medium mb-3">Macronutrient Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
                          Protein
                        </span>
                        <span>
                          {(totalProtein * 4 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9)).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(totalProtein * 4 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block mr-2"></span>
                          Carbs
                        </span>
                        <span>
                          {(totalCarbs * 4 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9)).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(totalCarbs * 4 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></span>
                          Fat
                        </span>
                        <span>
                          {(totalFat * 9 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9)).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(totalFat * 9 * 100 / (totalProtein * 4 + totalCarbs * 4 + totalFat * 9))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  Add food items to see your nutrition breakdown
                </p>
              </div>
            )}
          </div>
          
          {trackedItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Nutritional Goals</h2>
              <p className="text-gray-600 mb-6">Track your progress against daily recommended values.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-gray-600">{Math.round(totalCalories)} / 2000 kcal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${totalCalories > 2000 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min(totalCalories / 2000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-gray-600">{totalProtein.toFixed(1)} / 50g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(totalProtein / 50 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Carbohydrates</span>
                    <span className="text-sm text-gray-600">{totalCarbs.toFixed(1)} / 275g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(totalCarbs / 275 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm text-gray-600">{totalFat.toFixed(1)} / 65g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(totalFat / 65 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanner;