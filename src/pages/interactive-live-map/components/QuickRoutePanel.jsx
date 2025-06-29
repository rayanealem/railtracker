import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickRoutePanel = ({ 
  stations, 
  onPlanRoute, 
  onClose, 
  isVisible = false 
}) => {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [departureTime, setDepartureTime] = useState('now');
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePlanRoute = () => {
    if (fromStation && toStation && onPlanRoute) {
      onPlanRoute({
        from: fromStation,
        to: toStation,
        departureTime: departureTime
      });
    }
  };

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const filteredFromStations = stations.filter(station => 
    station.name.toLowerCase().includes(fromStation.toLowerCase())
  );

  const filteredToStations = stations.filter(station => 
    station.name.toLowerCase().includes(toStation.toLowerCase()) &&
    station.name !== fromStation
  );

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-100">
      <div className="bg-surface rounded-lg shadow-xl border border-border animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Route" size={20} className="text-primary" />
            <h3 className="font-semibold text-text-primary">Quick Route</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronDown" : "ChevronUp"}
              className="text-text-secondary hover:text-text-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              className="text-text-secondary hover:text-text-primary"
            />
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* From Station */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-primary mb-1">
                From
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter departure station"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="pl-10"
                />
                <Icon 
                  name="Circle" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-success"
                />
              </div>
              
              {/* From Station Suggestions */}
              {fromStation && filteredFromStations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg max-h-32 overflow-y-auto z-10">
                  {filteredFromStations.slice(0, 5).map((station) => (
                    <button
                      key={station.id}
                      className="w-full text-left px-3 py-2 hover:bg-surface-secondary text-sm text-text-primary"
                      onClick={() => setFromStation(station.name)}
                    >
                      {station.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwapStations}
                iconName="ArrowUpDown"
                className="text-text-secondary hover:text-text-primary"
                disabled={!fromStation || !toStation}
              />
            </div>

            {/* To Station */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-primary mb-1">
                To
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter destination station"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="pl-10"
                />
                <Icon 
                  name="MapPin" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-error"
                />
              </div>
              
              {/* To Station Suggestions */}
              {toStation && filteredToStations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg max-h-32 overflow-y-auto z-10">
                  {filteredToStations.slice(0, 5).map((station) => (
                    <button
                      key={station.id}
                      className="w-full text-left px-3 py-2 hover:bg-surface-secondary text-sm text-text-primary"
                      onClick={() => setToStation(station.name)}
                    >
                      {station.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Departure
              </label>
              <div className="flex space-x-2">
                <Button
                  variant={departureTime === 'now' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDepartureTime('now')}
                  className="flex-1"
                >
                  Now
                </Button>
                <Button
                  variant={departureTime !== 'now' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDepartureTime(new Date().toISOString().slice(0, 16))}
                  className="flex-1"
                >
                  Later
                </Button>
              </div>
              
              {departureTime !== 'now' && (
                <div className="mt-2">
                  <Input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>

            {/* Plan Route Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handlePlanRoute}
              iconName="Navigation"
              iconPosition="left"
              disabled={!fromStation || !toStation}
            >
              Plan Route
            </Button>
          </div>
        )}

        {/* Collapsed State */}
        {!isExpanded && (
          <div className="p-3">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Route" size={16} />
              <span>Tap to plan a route</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickRoutePanel;