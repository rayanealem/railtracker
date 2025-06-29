import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogoClick = () => {
    navigate('/public-transit-dashboard');
  };

  return (
    <header className="bg-surface border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Train" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-text-primary font-heading">
                RailTracker
              </h1>
              <p className="text-xs text-text-secondary font-caption">
                Admin Portal
              </p>
            </div>
          </button>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              iconName={isDarkMode ? "Sun" : "Moon"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="text-text-secondary hover:text-text-primary"
            />

            {/* Back to Public View */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/public-transit-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Public View
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;