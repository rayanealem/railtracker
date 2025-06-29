import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AuthenticatedHeader = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate('/admin-dashboard');
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    // Navigate to settings page when implemented
  };

  const isAdminDashboard = location.pathname === '/admin-dashboard';

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
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
          </div>

          {/* Admin Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={isAdminDashboard ? "primary" : "ghost"}
              size="sm"
              onClick={() => navigate('/admin-dashboard')}
              iconName="LayoutDashboard"
              iconPosition="left"
              className="px-3"
            >
              Dashboard
            </Button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleProfileToggle}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-primary)" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-border z-200 animate-fade-in">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {user?.email || 'admin@railtracker.com'}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors duration-200"
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Settings
                    </button>
                    
                    <button
                      onClick={() => navigate('/public-transit-dashboard')}
                      className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors duration-200"
                    >
                      <Icon name="ArrowLeft" size={16} className="mr-3" />
                      Public View
                    </button>
                    
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200"
                      >
                        <Icon name="LogOut" size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;