import React from 'react';


const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Loading...', 
  size = 'md',
  backdrop = true,
  className = '' 
}) => {
  if (!isVisible) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-400 flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Backdrop */}
      {backdrop && (
        <div className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm" />
      )}
      
      {/* Loading Content */}
      <div className="relative bg-surface rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className={`loading-spinner ${getSizeClasses()}`} />
          
          {/* Message */}
          <div className="text-center">
            <p className={`font-medium text-text-primary ${getTextSize()}`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative inline loading component for smaller contexts
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'sm',
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4';
      case 'sm':
        return 'w-5 h-5';
      case 'md':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`loading-spinner ${getSizeClasses()}`} />
      <span className="text-sm text-text-secondary">{message}</span>
    </div>
  );
};

// Route-specific loading states
export const RouteLoading = () => (
  <LoadingOverlay
    isVisible={true}
    message="Planning your route..."
    size="lg"
  />
);

export const MapLoading = () => (
  <LoadingOverlay
    isVisible={true}
    message="Loading live map data..."
    size="lg"
  />
);

export const AuthLoading = () => (
  <LoadingOverlay
    isVisible={true}
    message="Authenticating..."
    size="md"
  />
);

export const DataLoading = ({ message = "Updating transit data..." }) => (
  <InlineLoading
    message={message}
    size="sm"
    className="justify-center py-4"
  />
);

export default LoadingOverlay;