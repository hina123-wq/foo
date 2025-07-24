import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShoppingListItem } from '../types/recipe';
import { v4 as uuidv4 } from 'uuid';

interface ShoppingListState {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'checked'>) => void;
  addItems: (items: Omit<ShoppingListItem, 'id' | 'checked'>[]) => void;
  updateItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  toggleItemChecked: (id: string) => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, { ...item, id: uuidv4(), checked: false }],
        }));
      },
      
      addItems: (newItems) => {
        set((state) => {
          const itemsToAdd = newItems.map(item => ({
            ...item,
            id: uuidv4(),
            checked: false,
          }));
          
          return {
            items: [...state.items, ...itemsToAdd],
          };
        });
      },
      
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      clearItems: () => {
        set({ items: [] });
      },
      
      toggleItemChecked: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },
    }),
    {
      name: 'shopping-list',
    }
  )
);