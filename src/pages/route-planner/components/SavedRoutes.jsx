import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedRoutes = ({ 
  savedRoutes = [], 
  onSelectRoute,
  onDeleteRoute,
  className = ""
}) => {
  const [expandedRoute, setExpandedRoute] = useState(null);

  const formatTime = (timeString) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const toggleExpanded = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  if (savedRoutes.length === 0) {
    return (
      <div className={`bg-surface rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="Heart" size={20} className="text-text-secondary" />
          </div>
          <div>
            <h4 className="font-medium text-text-primary">No saved routes</h4>
            <p className="text-sm text-text-secondary">
              Save your favorite routes for quick access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Heart" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-text-primary">Saved Routes</h3>
            <p className="text-sm text-text-secondary">
              {savedRoutes.length} saved route{savedRoutes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {savedRoutes.map((route) => (
          <div key={route.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-text-primary truncate">
                    {route.fromStationName} → {route.toStationName}
                  </h4>
                  <span className="text-xs bg-surface-secondary text-text-secondary px-2 py-1 rounded">
                    {route.nickname || 'Daily Commute'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{formatDuration(route.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ArrowRightLeft" size={14} />
                    <span>{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={14} />
                    <span>${route.cost}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-text-secondary">
                  Saved {new Date(route.savedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={expandedRoute === route.id ? "ChevronUp" : "ChevronDown"}
                  onClick={() => toggleExpanded(route.id)}
                  title="View details"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectRoute(route)}
                >
                  Use Route
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onDeleteRoute(route.id)}
                  className="text-error hover:text-error"
                  title="Delete route"
                />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRoute === route.id && (
              <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Departure:</span>
                      <div className="font-medium text-text-primary">
                        {formatTime(route.departureTime)}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Arrival:</span>
                      <div className="font-medium text-text-primary">
                        {formatTime(route.arrivalTime)}
                      </div>
                    </div>
                  </div>

                  {/* Route Steps Preview */}
                  <div>
                    <span className="text-sm text-text-secondary mb-2 block">Route:</span>
                    <div className="flex items-center space-x-2 text-sm">
                      {route.steps.map((step, index) => (
                        <React.Fragment key={index}>
                          {step.type === 'train' ? (
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: step.lineColor }}
                              >
                                {step.lineCode}
                              </div>
                              <span className="text-text-primary">{step.lineName}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Icon name="Footprints" size={14} className="text-text-secondary" />
                              <span className="text-text-secondary">Walk</span>
                            </div>
                          )}
                          {index < route.steps.length - 1 && (
                            <Icon name="ArrowRight" size={12} className="text-text-secondary" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRoutes;