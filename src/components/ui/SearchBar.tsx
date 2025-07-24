import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(query.trim())}`);
      if (onSearch) onSearch();
      setQuery('');
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-3 pl-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500"
          placeholder="Search for recipes, ingredients, cuisines..."
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-10 flex items-center pr-3"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 text-sm transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;