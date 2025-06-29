import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import StationSelector from './StationSelector';

const JourneyForm = ({ 
  stations = [], 
  onPlanJourney, 
  isLoading = false,
  className = ""
}) => {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [departureTime, setDepartureTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [journeyType, setJourneyType] = useState('depart'); // 'depart' or 'arrive'

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handlePlanJourney = () => {
    if (!fromStation || !toStation) {
      return;
    }

    const journeyData = {
      from: fromStation,
      to: toStation,
      date: departureDate,
      time: departureTime,
      type: journeyType
    };

    onPlanJourney(journeyData);
  };

  const isFormValid = fromStation && toStation && fromStation !== toStation;

  return (
    <div className={`bg-surface rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon name="Route" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Plan Your Journey</h2>
          <p className="text-sm text-text-secondary">Find the best route between stations</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Station Selectors */}
        <div className="space-y-4">
          <StationSelector
            label="From"
            value={fromStation}
            onChange={(station) => setFromStation(station.id)}
            stations={stations}
            placeholder="Select departure station"
          />

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapStations}
              iconName="ArrowUpDown"
              className="rounded-full w-10 h-10 p-0"
              title="Swap stations"
            />
          </div>

          <StationSelector
            label="To"
            value={toStation}
            onChange={(station) => setToStation(station.id)}
            stations={stations}
            placeholder="Select destination station"
          />
        </div>

        {/* Journey Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Journey Type
          </label>
          <div className="flex bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setJourneyType('depart')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                journeyType === 'depart' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="ArrowRight" size={16} className="inline mr-2" />
              Depart at
            </button>
            <button
              onClick={() => setJourneyType('arrive')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                journeyType === 'arrive' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="ArrowLeft" size={16} className="inline mr-2" />
              Arrive by
            </button>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date
            </label>
            <Input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time
            </label>
            <Input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
        </div>

        {/* Plan Journey Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handlePlanJourney}
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          iconName="Search"
          iconPosition="left"
          fullWidth
        >
          {isLoading ? 'Planning Journey...' : 'Plan Journey'}
        </Button>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-text-primary mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Clock"
              iconPosition="left"
            >
              Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
            >
              Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Star"
              iconPosition="left"
            >
              Favorites
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyForm;