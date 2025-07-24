import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShoppingListStore } from '../store/shoppingListStore';

const ShoppingList: React.FC = () => {
  const { items, toggleItemChecked, removeItem, addItem, clearItems } = useShoppingListStore();
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: '' });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group items by recipe
  const itemsByRecipe = items.reduce((acc, item) => {
    const key = item.recipeId ? `recipe-${item.recipeId}` : 'custom';
    if (!acc[key]) {
      acc[key] = {
        title: item.recipeTitle || 'Custom Items',
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { title: string; items: typeof items }>);

  // Separate checked and unchecked items
  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim()) {
      addItem({
        name: newItem.name.trim(),
        amount: newItem.amount,
        unit: newItem.unit.trim(),
      });
      setNewItem({ name: '', amount: 1, unit: '' });
    }
  };

  const handleClearChecked = () => {
    checkedItems.forEach(item => removeItem(item.id));
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const renderItemsList = (itemsList: typeof items) => {
    return itemsList.map(item => (
      <motion.li
        key={item.id}
        className={`flex items-center p-3 rounded-lg mb-2 ${
          item.checked ? 'bg-gray-100' : 'bg-white'
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => toggleItemChecked(item.id)}
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border ${
            item.checked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-label={item.checked ? 'Mark as unchecked' : 'Mark as checked'}
        >
          {item.checked && <Check className="w-4 h-4" />}
        </button>
        <div className="flex-1">
          <span className={`${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {item.name}
          </span>
          {(item.amount || item.unit) && (
            <span className="ml-2 text-sm text-gray-500">
              {item.amount} {item.unit}
            </span>
          )}
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </motion.li>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping List</h1>
        <p className="text-gray-600">Keep track of all ingredients you need for your recipes.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Add Item Form */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              min="0"
              step="0.1"
              onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) })}
              className="w-20 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="w-24 sm:w-28 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </form>
        </motion.div>

        {/* Shopping List */}
        {items.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold">Your Shopping List</h2>
              </div>
              <div className="flex gap-2">
                {checkedItems.length > 0 && (
                  <button
                    onClick={handleClearChecked}
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Checked
                  </button>
                )}
                {items.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all items?')) {
                        clearItems();
                      }
                    }}
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Active List - Unchecked Items */}
            {uncheckedItems.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-3">Items to Buy ({uncheckedItems.length})</h3>
                <ul>{renderItemsList(uncheckedItems)}</ul>
              </div>
            )}

            {/* By Recipe */}
            {Object.keys(itemsByRecipe).length > 1 && (
              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-3">By Recipe</h3>
                {Object.entries(itemsByRecipe).map(([key, { title, items }]) => (
                  <div key={key} className="mb-3">
                    <button
                      onClick={() => toggleCategory(key)}
                      className="flex items-center justify-between w-full text-left py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <span className="font-medium">{title}</span>
                      <span className="text-gray-500 text-sm">{items.length} items</span>
                    </button>
                    {activeCategory === key && (
                      <div className="mt-2 pl-2">
                        <ul>{renderItemsList(items)}</ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Checked Items */}
            {checkedItems.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Purchased Items ({checkedItems.length})</h3>
                <ul>{renderItemsList(checkedItems)}</ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your shopping list is empty</h2>
            <p className="text-gray-600 mb-6">
              Add items manually or add ingredients from recipes to your shopping list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;