import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Heart, Instagram, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const whatsappNumber = '+918886999477';
  const whatsappMessage = 'Hi! I would like to know more about your products.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <header className="nav-glass sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 text-gray-800 py-2 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">✨ Free shipping on orders above ₹1999</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/ragabymallika/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent transition-transform group-hover:scale-105">
              RAGA BY MALLIKA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors font-medium relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-amber-600 transition-colors font-medium relative group">
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-amber-600 transition-colors font-medium relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button className="text-gray-700 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50">
              <Heart className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50">
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 font-medium">Hi, {user.name}</span>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="btn-gold px-3 py-1 rounded-md text-sm font-medium shadow-md"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-gold px-4 py-2 rounded-md text-sm font-medium shadow-md"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-amber-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="input-pastel w-full px-4 py-3 rounded-lg focus:outline-none"
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-amber-100">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/"
              className="block py-3 text-gray-700 hover:text-amber-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-3 text-gray-700 hover:text-amber-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="block py-3 text-gray-700 hover:text-amber-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="block py-3 text-gray-700 hover:text-amber-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-gray-700 hover:text-amber-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;