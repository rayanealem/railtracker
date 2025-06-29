import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import stationService from '../../../utils/stationService';

const StationSelector = ({ onRouteSelect, initialFrom, initialTo }) => {
  const [stations, setStations] = useState([]);
  const [fromStation, setFromStation] = useState(initialFrom || '');
  const [toStation, setToStation] = useState(initialTo || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStations = async () => {
      try {
        const result = await stationService.getStations();
        if (result?.success && isMounted) {
          setStations(result.data || []);
        }
      } catch (error) {
        // Silently fail, component will show without station options
      }
    };

    loadStations();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setFromStation(initialFrom || '');
    setToStation(initialTo || '');
  }, [initialFrom, initialTo]);

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleFindRoute = () => {
    if (fromStation && toStation && onRouteSelect) {
      setIsLoading(true);
      
      const fromStationData = stations.find(s => s?.id === fromStation);
      const toStationData = stations.find(s => s?.id === toStation);
      
      onRouteSelect({
        from: fromStationData,
        to: toStationData
      });
      
      // Reset loading after a short delay to show user feedback
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-text-primary">Plan Your Journey</h2>
      </div>

      <div className="space-y-4">
        {/* From Station */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            From Station
          </label>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select departure station</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapStations}
            disabled={!fromStation || !toStation}
            className="p-3 rounded-full bg-background border border-border hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Swap stations"
          >
            <ArrowRight className="w-5 h-5 text-text-secondary transform rotate-90" />
          </button>
        </div>

        {/* To Station */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            To Station
          </label>
          <select
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select destination station</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Find Route Button */}
        <button
          onClick={handleFindRoute}
          disabled={!fromStation || !toStation || fromStation === toStation || isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Finding Route...
            </div>
          ) : (
            'Find Route'
          )}
        </button>

        {fromStation === toStation && fromStation && (
          <p className="text-sm text-warning text-center">
            Please select different stations for departure and destination.
          </p>
        )}
      </div>
    </div>
  );
};

export default StationSelector;