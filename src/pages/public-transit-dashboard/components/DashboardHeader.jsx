import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardHeader = ({ onRefresh, lastUpdated }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
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

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-surface border-b border-border sticky top-16 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Status */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-heading">
                Transit Dashboard
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-text-secondary">
                  {currentTime.toLocaleString()}
                </p>
                {lastUpdated && (
                  <div className="flex items-center space-x-1 text-xs text-text-secondary">
                    <Icon name="RefreshCw" size={12} />
                    <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              iconName={isDarkMode ? "Sun" : "Moon"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="hidden sm:flex"
            />

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              iconName="RefreshCw"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Refresh
            </Button>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                iconName={isDarkMode ? "Sun" : "Moon"}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                iconName="RefreshCw"
              />
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">System Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">Real-time Data</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Icon name="Wifi" size={14} className="text-success" />
            <span className="text-sm text-text-secondary">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;