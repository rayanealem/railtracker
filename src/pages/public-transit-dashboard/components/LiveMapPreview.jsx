import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveMapPreview = ({ trains = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleExpandMap = () => {
    navigate('/interactive-live-map');
  };

  const togglePreview = () => {
    setIsExpanded(!isExpanded);
  };

  const activeTrains = trains.filter(train => train.status !== 'cancelled');

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Map" size={18} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Live Map</h2>
              <p className="text-sm text-text-secondary">
                {activeTrains.length} trains active
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreview}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              className="lg:hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandMap}
              iconName="Maximize2"
              iconPosition="left"
            >
              Full Map
            </Button>
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="relative h-64 lg:h-80 bg-secondary-50">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-30"></div>
          
          {/* Mock Train Positions */}
          <div className="absolute inset-0 p-4">
            {activeTrains.slice(0, 6).map((train, index) => (
              <div
                key={train.id}
                className="absolute w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg"
                style={{
                  left: `${20 + (index * 12)}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                title={`${train.route} - ${train.destination}`}
              >
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary-200 rounded-full animate-ping opacity-75"></div>
              </div>
            ))}
          </div>

          {/* Mock Route Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-accent)" />
              </linearGradient>
            </defs>
            <path
              d="M 20 50 Q 150 30 280 60 Q 350 80 400 50"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
            <path
              d="M 50 80 Q 180 100 320 90 Q 380 85 420 70"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-surface bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-text-secondary">On Time: {activeTrains.filter(t => t.status === 'on-time').length}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-text-secondary">Delayed: {activeTrains.filter(t => t.status === 'delayed').length}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Click Overlay */}
          <button
            onClick={handleExpandMap}
            className="absolute inset-0 w-full h-full bg-transparent hover:bg-primary hover:bg-opacity-5 transition-colors duration-200 cursor-pointer"
            title="Click to open full map"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="bg-surface bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2 text-text-primary">
                  <Icon name="Maximize2" size={16} />
                  <span className="text-sm font-medium">Open Full Map</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-surface-secondary">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-text-primary">{activeTrains.length}</p>
            <p className="text-xs text-text-secondary">Active Trains</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-success">{activeTrains.filter(t => t.status === 'on-time').length}</p>
            <p className="text-xs text-text-secondary">On Time</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-warning">{activeTrains.filter(t => t.status === 'delayed').length}</p>
            <p className="text-xs text-text-secondary">Delayed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapPreview;