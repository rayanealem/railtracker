import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginBackground = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-surface to-secondary-50 -z-10">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Right Decoration */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Bottom Left Decoration */}
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        
        {/* Center Background Pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 64 }).map((_, index) => (
              <div
                key={index}
                className="bg-primary rounded-sm animate-pulse"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 text-primary-200 opacity-30 animate-bounce">
          <Icon name="Train" size={24} />
        </div>
        
        <div className="absolute top-3/4 right-1/4 text-accent-200 opacity-30 animate-bounce delay-500">
          <Icon name="MapPin" size={20} />
        </div>
        
        <div className="absolute top-1/2 right-1/3 text-secondary-200 opacity-30 animate-bounce delay-1000">
          <Icon name="Clock" size={18} />
        </div>
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      ></div>
    </div>
  );
};

export default LoginBackground;