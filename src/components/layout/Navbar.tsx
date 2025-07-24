import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Menu, X, Search, LogOut, User } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Diet Planner', path: '/diet-planner' },
    { name: 'Meal Scheduler', path: '/meal-scheduler' },
    { name: 'Shopping List', path: '/shopping-list' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Goals', path: '/goals' },
    { name: 'Cuisines', path: '/cuisines' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Add Recipe', path: '/add-recipe' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-800">Fresh Healthy Bite</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                  isActive(link.path) 
                    ? 'text-orange-600' 
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu & Search */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-500"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleSearch}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showSearch ? 'auto' : 0,
            opacity: showSearch ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden mt-4"
        >
          <SearchBar onSearch={() => setShowSearch(false)} />
        </motion.div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden mt-4"
        >
          <div className="flex flex-col space-y-2 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Navbar;