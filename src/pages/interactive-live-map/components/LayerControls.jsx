import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LayerControls = ({ 
  onLayerToggle, 
  activeLayers = {
    trains: true,
    stations: true,
    routes: true,
    alerts: true,
    traffic: false
  },
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layers = [
    {
      id: 'trains',
      name: 'Trains',
      icon: 'Train',
      description: 'Live train positions'
    },
    {
      id: 'stations',
      name: 'Stations',
      icon: 'MapPin',
      description: 'Station locations'
    },
    {
      id: 'routes',
      name: 'Routes',
      icon: 'Route',
      description: 'Rail lines and tracks'
    },
    {
      id: 'alerts',
      name: 'Service Alerts',
      icon: 'AlertTriangle',
      description: 'Delays and disruptions'
    },
    {
      id: 'traffic',
      name: 'Traffic',
      icon: 'Car',
      description: 'Road traffic conditions'
    }
  ];

  const handleLayerToggle = (layerId) => {
    if (onLayerToggle) {
      onLayerToggle(layerId, !activeLayers[layerId]);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-surface rounded-lg shadow-lg border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Layers" size={18} className="text-primary" />
          <span className="font-medium text-text-primary text-sm">Map Layers</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          className="w-6 h-6 p-0 text-text-secondary hover:text-text-primary"
        />
      </div>

      {/* Layer Controls */}
      {isExpanded && (
        <div className="p-2 space-y-1">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-surface-secondary transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  activeLayers[layer.id] ? 'bg-primary text-white' : 'bg-secondary-200 text-text-muted'
                }`}>
                  <Icon name={layer.icon} size={14} />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {layer.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {layer.description}
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleLayerToggle(layer.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  activeLayers[layer.id] ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                    activeLayers[layer.id] ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-2">
          <div className="flex items-center justify-center space-x-1">
            {Object.entries(activeLayers)
              .filter(([_, isActive]) => isActive)
              .slice(0, 4)
              .map(([layerId], index) => {
                const layer = layers.find(l => l.id === layerId);
                return (
                  <div
                    key={layerId}
                    className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center"
                    title={layer?.name}
                  >
                    <Icon name={layer?.icon || 'Circle'} size={10} color="white" />
                  </div>
                );
              })}
            {Object.values(activeLayers).filter(Boolean).length > 4 && (
              <div className="text-xs text-text-secondary">
                +{Object.values(activeLayers).filter(Boolean).length - 4}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControls;