import React, { useState } from 'react';
import { Sprout, Languages, Menu, X, Settings, Bell, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';

function Header({ language, setLanguage, user, onLogout }) {
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  // Initialize the navigation hook
  const navigate = useNavigate();

  // --- NAVIGATION HANDLER ---
  const handleNavigation = (path) => {
    // 1. Close mobile menu if it's open
    setMobileMenuOpen(false);
    
    // 2. Perform the actual redirection
    navigate(path);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 animate-slideInLeft">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">🌾 Empowering 50,000+ farmers across India</span>
            <span className="md:hidden">🌾 50K+ Farmers</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* HELP BUTTON */}
            <button 
                onClick={() => handleNavigation('/help')}
                className="hover:text-green-200 transition flex items-center space-x-1 focus:outline-none"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Help</span>
            </button>
            
            <div className="h-4 w-px bg-white opacity-30"></div>
            
            {/* SETTINGS BUTTON */}
            <button 
                onClick={() => handleNavigation('/settings')}
                className="hover:text-green-200 transition flex items-center space-x-1 focus:outline-none"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Title - Goes to Home */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Sprout className="w-10 h-10 text-green-600 relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI-Based Crop Recommendation
              </h1>
              <p className="text-sm text-gray-600 hidden md:block">{t.subtitle}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Notification Bell */}
            <button 
                onClick={() => handleNavigation('/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="ml-2 text-sm text-red-600 hover:text-red-700 font-semibold focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all">
              <Languages className="w-5 h-5 text-green-600" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-800 font-medium cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="od">ଓଡ଼ିଆ</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* CTA Button */}
            <button 
                onClick={() => handleNavigation('/get-started')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 btn-ripple focus:outline-none"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fadeIn">
            <div className="space-y-3">
              {/* Mobile Language Selector */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border-2 border-green-200">
                <Languages className="w-5 h-5 text-green-600" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none text-gray-800 font-medium"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="od">ଓଡ଼ିଆ (Odia)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              {/* Mobile Notification */}
              <button 
                onClick={() => handleNavigation('/notifications')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Notifications</span>
                </div>
                {notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Mobile Settings */}
              <button 
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors focus:outline-none"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Settings</span>
              </button>

              {/* Mobile Help */}
              <button 
                onClick={() => handleNavigation('/help')}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors focus:outline-none"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Help & Support</span>
              </button>

              {/* Mobile CTA */}
              <button 
                onClick={() => handleNavigation('/get-started')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg focus:outline-none"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
    </header>
  );
}

export default Header;