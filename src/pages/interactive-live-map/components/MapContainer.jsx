import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  trains, 
  stations, 
  selectedTrain, 
  selectedStation,
  onTrainSelect, 
  onStationSelect,
  userLocation,
  mapCenter,
  onMapCenterChange,
  zoomLevel,
  onZoomChange
}) => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Mock map bounds for train positioning
  const mapBounds = {
    north: 40.7829,
    south: 40.7489,
    east: -73.9441,
    west: -74.0059
  };

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    if (zoomLevel < 18) {
      onZoomChange(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 8) {
      onZoomChange(zoomLevel - 1);
    }
  };

  const handleCenterMap = () => {
    if (userLocation) {
      onMapCenterChange(userLocation);
    }
  };

  const getTrainPosition = (train) => {
    // Calculate position based on route progress
    const progress = train.routeProgress || 0;
    const baseX = 20 + (progress * 60); // 20% to 80% of container width
    const baseY = 30 + (train.id * 8) % 40; // Distribute vertically
    
    return {
      x: `${baseX}%`,
      y: `${baseY}%`
    };
  };

  const getStationPosition = (station) => {
    // Fixed positions for stations
    const positions = {
      'ST001': { x: '25%', y: '20%' },
      'ST002': { x: '45%', y: '35%' },
      'ST003': { x: '65%', y: '50%' },
      'ST004': { x: '35%', y: '65%' },
      'ST005': { x: '55%', y: '80%' },
      'ST006': { x: '75%', y: '25%' }
    };
    
    return positions[station.id] || { x: '50%', y: '50%' };
  };

  const getRouteColor = (routeId) => {
    const colors = {
      'blue-line': '#2563EB',
      'red-line': '#DC2626',
      'green-line': '#059669',
      'yellow-line': '#D97706'
    };
    return colors[routeId] || '#64748B';
  };

  return (
    <div className="relative w-full h-full bg-secondary-100 overflow-hidden">
      {/* Map Background */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-secondary-50 to-secondary-200"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(5, 150, 105, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(100, 116, 139, 0.1) 50%, transparent 51%)
          `
        }}
      >
        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Blue Line */}
          <path
            d="M 20% 20% Q 40% 30% 60% 40% T 80% 60%"
            stroke={getRouteColor('blue-line')}
            strokeWidth="4"
            fill="none"
            strokeDasharray="0"
            opacity="0.8"
          />
          {/* Red Line */}
          <path
            d="M 30% 80% Q 50% 60% 70% 40% T 90% 20%"
            stroke={getRouteColor('red-line')}
            strokeWidth="4"
            fill="none"
            strokeDasharray="0"
            opacity="0.8"
          />
          {/* Green Line */}
          <path
            d="M 10% 50% L 90% 50%"
            stroke={getRouteColor('green-line')}
            strokeWidth="4"
            fill="none"
            strokeDasharray="0"
            opacity="0.8"
          />
        </svg>

        {/* Station Markers */}
        {stations.map((station) => {
          const position = getStationPosition(station);
          const isSelected = selectedStation?.id === station.id;
          
          return (
            <button
              key={station.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                isSelected ? 'z-30' : 'z-20'
              }`}
              style={{
                left: position.x,
                top: position.y
              }}
              onClick={() => onStationSelect(station)}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                isSelected 
                  ? 'bg-primary border-primary-foreground shadow-lg' 
                  : 'bg-surface border-primary shadow-md'
              }`} />
              <div className={`absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded shadow-sm ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-text-primary border border-border'
              }`}>
                {station.name}
              </div>
            </button>
          );
        })}

        {/* Train Markers */}
        {trains.map((train) => {
          const position = getTrainPosition(train);
          const isSelected = selectedTrain?.id === train.id;
          const routeColor = getRouteColor(train.route);
          
          return (
            <button
              key={train.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                isSelected ? 'z-40' : 'z-30'
              }`}
              style={{
                left: position.x,
                top: position.y
              }}
              onClick={() => onTrainSelect(train)}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: routeColor }}
              >
                <Icon 
                  name="Train" 
                  size={12} 
                  color="white"
                  className={`transform ${train.direction === 'eastbound' ? 'rotate-90' : train.direction === 'westbound' ? '-rotate-90' : ''}`}
                />
              </div>
              
              {/* Train Status Indicator */}
              {train.status === 'delayed' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full border border-white animate-pulse" />
              )}
            </button>
          );
        })}

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25"
            style={{
              left: '50%',
              top: '60%'
            }}
          >
            <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute w-8 h-8 bg-accent rounded-full opacity-20 -top-2 -left-2 animate-ping" />
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50">
        <Button
          variant="primary"
          size="sm"
          onClick={handleZoomIn}
          iconName="Plus"
          disabled={zoomLevel >= 18}
          className="w-10 h-10 p-0 shadow-lg"
          title="Zoom in"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleZoomOut}
          iconName="Minus"
          disabled={zoomLevel <= 8}
          className="w-10 h-10 p-0 shadow-lg"
          title="Zoom out"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCenterMap}
          iconName="Crosshair"
          className="w-10 h-10 p-0 shadow-lg"
          title="Center on location"
        />
      </div>

      {/* Loading Overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-surface bg-opacity-90 flex items-center justify-center z-100">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-text-secondary">Loading map data...</p>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-surface rounded-lg shadow-lg p-3 z-50">
        <h4 className="text-sm font-semibold text-text-primary mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-text-secondary">Stations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-secondary-500 flex items-center justify-center">
              <Icon name="Train" size={8} color="white" />
            </div>
            <span className="text-text-secondary">Trains</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-text-secondary">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;