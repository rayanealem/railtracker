import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import stationService from '../../../utils/stationService';

const RoutePlannerWidget = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
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
        // Silently fail, widget will show without station options
      }
    };

    loadStations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlanRoute = () => {
    if (startStation && endStation) {
      const params = new URLSearchParams({
        from: startStation,
        to: endStation
      });
      navigate(`/route-planner?${params.toString()}`);
    }
  };

  const handleSwapStations = () => {
    const temp = startStation;
    setStartStation(endStation);
    setEndStation(temp);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Plan Your Journey</h3>
      </div>

      <div className="space-y-4">
        {/* Start Station */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            From
          </label>
          <select
            value={startStation}
            onChange={(e) => setStartStation(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select start station</option>
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
            className="p-2 rounded-full bg-background border border-border hover:bg-surface transition-colors"
            disabled={!startStation || !endStation}
          >
            <ArrowRight className="w-4 h-4 text-text-secondary transform rotate-90" />
          </button>
        </div>

        {/* End Station */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            To
          </label>
          <select
            value={endStation}
            onChange={(e) => setEndStation(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select destination</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Route Button */}
        <button
          onClick={handlePlanRoute}
          disabled={!startStation || !endStation || isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Planning...' : 'Find Route'}
        </button>

        {/* Quick Links */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-text-secondary mb-2">Quick actions:</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/interactive-live-map')}
              className="block w-full text-left text-sm text-primary hover:text-primary-dark transition-colors"
            >
              View Live Map
            </button>
            <button
              onClick={() => navigate('/route-planner')}
              className="block w-full text-left text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Advanced Route Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerWidget;