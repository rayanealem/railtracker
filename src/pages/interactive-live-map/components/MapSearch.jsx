import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MapSearch = ({ 
  stations, 
  trains, 
  onStationSelect, 
  onTrainSelect, 
  onLocationSearch,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      
      // Search stations
      const stationResults = stations
        .filter(station => 
          station.name.toLowerCase().includes(query) ||
          station.zone.toLowerCase().includes(query)
        )
        .slice(0, 5)
        .map(station => ({
          type: 'station',
          id: station.id,
          title: station.name,
          subtitle: `${station.zone} • ${station.lines.length} line${station.lines.length !== 1 ? 's' : ''}`,
          data: station
        }));

      // Search trains
      const trainResults = trains
        .filter(train => 
          train.number.toLowerCase().includes(query) ||
          train.destination.toLowerCase().includes(query) ||
          train.route.toLowerCase().includes(query)
        )
        .slice(0, 3)
        .map(train => ({
          type: 'train',
          id: train.id,
          title: `Train ${train.number}`,
          subtitle: `${train.destination} • ${train.route.replace('-', ' ')} Line`,
          data: train
        }));

      setSearchResults([...stationResults, ...trainResults]);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, stations, trains]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultSelect = (result) => {
    if (result.type === 'station') {
      onStationSelect(result.data);
    } else if (result.type === 'train') {
      onTrainSelect(result.data);
    }
    
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const getResultIcon = (type) => {
    return type === 'station' ? 'MapPin' : 'Train';
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search stations, trains, or routes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 bg-surface shadow-lg border-border"
        />
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            iconName="X"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-text-secondary hover:text-text-primary"
          />
        )}
      </div>

      {/* Search Results */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto z-50 animate-fade-in">
          {searchResults.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              className="w-full flex items-center space-x-3 p-3 hover:bg-surface-secondary transition-colors duration-200 text-left border-b border-border last:border-b-0"
              onClick={() => handleResultSelect(result)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result.type === 'station' ? 'bg-primary' : 'bg-secondary-500'
              }`}>
                <Icon 
                  name={getResultIcon(result.type)} 
                  size={16} 
                  color="white"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary truncate">
                  {result.title}
                </div>
                <div className="text-sm text-text-secondary truncate">
                  {result.subtitle}
                </div>
              </div>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-text-muted flex-shrink-0"
              />
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isSearchOpen && searchQuery && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-xl p-4 z-50 animate-fade-in">
          <div className="text-center text-text-secondary">
            <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for station names, train numbers, or routes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSearch;