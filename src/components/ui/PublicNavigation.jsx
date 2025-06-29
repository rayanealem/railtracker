import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PublicNavigation = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/public-transit-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Real-time transit overview'
    },
    {
      label: 'Plan Route',
      path: '/route-planner',
      icon: 'Route',
      tooltip: 'Journey planning and schedules'
    },
    {
      label: 'Live Map',
      path: '/interactive-live-map',
      icon: 'Map',
      tooltip: 'Real-time train tracking'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleLogoClick = () => {
    navigate('/public-transit-dashboard');
  };

  const handleAdminAccess = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
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
                    Real-time Transit
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item.path)}
                    iconName={item.icon}
                    iconPosition="left"
                    className="px-3"
                    title={item.tooltip}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Admin Access */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminAccess}
                iconName="Shield"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Admin
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                iconName={isMobileMenuOpen ? "X" : "Menu"}
                className="md:hidden"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-200 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-secondary-900 bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-64 bg-surface shadow-lg animate-slide-in">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <Icon name="Train" size={14} color="white" />
                  </div>
                  <span className="font-semibold text-text-primary">Menu</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  iconName="X"
                />
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.tooltip}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Admin Access */}
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdminAccess}
                  iconName="Shield"
                  iconPosition="left"
                  fullWidth
                >
                  Admin Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavigation;