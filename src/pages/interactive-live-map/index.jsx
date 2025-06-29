import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavigation from '../../components/ui/PublicNavigation';
import MapContainer from './components/MapContainer';
import TrainPopup from './components/TrainPopup';
import StationPopup from './components/StationPopup';
import QuickRoutePanel from './components/QuickRoutePanel';
import MapSearch from './components/MapSearch';
import LayerControls from './components/LayerControls';
import AlertBanner from '../../components/ui/AlertBanner';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

import Button from '../../components/ui/Button';

const InteractiveLiveMap = () => {
  const navigate = useNavigate();
  
  // State management
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isRoutePanel, setIsRoutePanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [activeLayers, setActiveLayers] = useState({
    trains: true,
    stations: true,
    routes: true,
    alerts: true,
    traffic: false
  });

  // Mock user location
  const [userLocation] = useState({ lat: 40.7589, lng: -73.9851 });

  // Mock data
  const mockTrains = [
    {
      id: 'T001',
      number: '4521',
      route: 'blue-line',
      routeColor: '#2563EB',
      destination: 'Downtown Central',
      status: 'on-time',
      delayMinutes: 0,
      currentLocation: 'Approaching Union Station',
      nextStation: {
        name: 'Union Station',
        eta: '2 min'
      },
      speed: 35,
      capacity: 68,
      direction: 'southbound',
      routeProgress: 0.3,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'T002',
      number: '3847',
      route: 'red-line',
      routeColor: '#DC2626',
      destination: 'Airport Terminal',
      status: 'delayed',
      delayMinutes: 8,
      currentLocation: 'Between Metro Center and Gallery Place',
      nextStation: {
        name: 'Gallery Place',
        eta: '4 min'
      },
      speed: 25,
      capacity: 85,
      direction: 'eastbound',
      routeProgress: 0.6,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'T003',
      number: '2156',
      route: 'green-line',
      routeColor: '#059669',
      destination: 'West End Plaza',
      status: 'on-time',
      delayMinutes: 0,
      currentLocation: 'Departing City Hall',
      nextStation: {
        name: 'Business District',
        eta: '3 min'
      },
      speed: 40,
      capacity: 42,
      direction: 'westbound',
      routeProgress: 0.8,
      lastUpdated: new Date().toISOString()
    }
  ];

  const mockStations = [
    {
      id: 'ST001',
      name: 'Union Station',
      zone: 'Zone 1',
      accessibility: true,
      address: '123 Union Ave, Downtown',
      lines: [
        { id: 'blue-line', name: 'Blue Line' },
        { id: 'red-line', name: 'Red Line' }
      ],
      upcomingArrivals: [
        {
          trainNumber: '4521',
          destination: 'Downtown Central',
          line: 'blue-line',
          scheduledTime: new Date(Date.now() + 2 * 60000).toISOString(),
          status: 'on-time',
          delayMinutes: 0
        },
        {
          trainNumber: '3847',
          destination: 'Airport Terminal',
          line: 'red-line',
          scheduledTime: new Date(Date.now() + 12 * 60000).toISOString(),
          status: 'delayed',
          delayMinutes: 8
        }
      ],
      facilities: [
        { type: 'parking', name: 'Parking', available: true },
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: true },
        { type: 'elevator', name: 'Elevator', available: false },
        { type: 'bike-rack', name: 'Bike Racks', available: true }
      ]
    },
    {
      id: 'ST002',
      name: 'Metro Center',
      zone: 'Zone 1',
      accessibility: true,
      address: '456 Metro Blvd, City Center',
      lines: [
        { id: 'blue-line', name: 'Blue Line' },
        { id: 'green-line', name: 'Green Line' }
      ],
      upcomingArrivals: [
        {
          trainNumber: '2156',
          destination: 'West End Plaza',
          line: 'green-line',
          scheduledTime: new Date(Date.now() + 5 * 60000).toISOString(),
          status: 'on-time',
          delayMinutes: 0
        }
      ],
      facilities: [
        { type: 'parking', name: 'Parking', available: true },
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: true },
        { type: 'elevator', name: 'Elevator', available: true }
      ]
    },
    {
      id: 'ST003',
      name: 'Gallery Place',
      zone: 'Zone 2',
      accessibility: false,
      address: '789 Gallery St, Arts District',
      lines: [
        { id: 'red-line', name: 'Red Line' }
      ],
      upcomingArrivals: [
        {
          trainNumber: '3847',
          destination: 'Airport Terminal',
          line: 'red-line',
          scheduledTime: new Date(Date.now() + 4 * 60000).toISOString(),
          status: 'delayed',
          delayMinutes: 8
        }
      ],
      facilities: [
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: false },
        { type: 'bike-rack', name: 'Bike Racks', available: true }
      ]
    },
    {
      id: 'ST004',
      name: 'City Hall',
      zone: 'Zone 1',
      accessibility: true,
      address: '321 Government Plaza, Civic Center',
      lines: [
        { id: 'green-line', name: 'Green Line' }
      ],
      upcomingArrivals: [],
      facilities: [
        { type: 'parking', name: 'Parking', available: true },
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: true },
        { type: 'elevator', name: 'Elevator', available: true }
      ]
    },
    {
      id: 'ST005',
      name: 'Business District',
      zone: 'Zone 2',
      accessibility: true,
      address: '654 Commerce Way, Financial District',
      lines: [
        { id: 'green-line', name: 'Green Line' }
      ],
      upcomingArrivals: [
        {
          trainNumber: '2156',
          destination: 'West End Plaza',
          line: 'green-line',
          scheduledTime: new Date(Date.now() + 3 * 60000).toISOString(),
          status: 'on-time',
          delayMinutes: 0
        }
      ],
      facilities: [
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: true }
      ]
    },
    {
      id: 'ST006',
      name: 'Airport Terminal',
      zone: 'Zone 3',
      accessibility: true,
      address: '987 Airport Rd, International Airport',
      lines: [
        { id: 'red-line', name: 'Red Line' }
      ],
      upcomingArrivals: [],
      facilities: [
        { type: 'parking', name: 'Parking', available: true },
        { type: 'wifi', name: 'Free WiFi', available: true },
        { type: 'restroom', name: 'Restrooms', available: true },
        { type: 'elevator', name: 'Elevator', available: true },
        { type: 'bike-rack', name: 'Bike Racks', available: false }
      ]
    }
  ];

  const mockAlerts = [
    {
      id: 'alert-001',
      severity: 'warning',
      title: 'Service Delay',
      message: 'Red Line experiencing 8-minute delays due to signal maintenance at Gallery Place.',
      timestamp: new Date().toISOString(),
      dismissible: true
    }
  ];

  // Effects
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-update train positions every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real app, this would fetch new data
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setSelectedStation(null);
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setSelectedTrain(null);
  };

  const handleClosePopups = () => {
    setSelectedTrain(null);
    setSelectedStation(null);
  };

  const handleViewRoute = (train) => {
    navigate('/route-planner', { 
      state: { 
        selectedTrain: train,
        fromMap: true 
      } 
    });
  };

  const handlePlanRoute = (routeData) => {
    if (routeData.from && routeData.to) {
      navigate('/route-planner', { 
        state: { 
          fromStation: routeData.from,
          toStation: routeData.to,
          departureTime: routeData.departureTime,
          fromMap: true 
        } 
      });
    }
    setIsRoutePanel(false);
  };

  const handlePlanRouteFromStation = (station) => {
    navigate('/route-planner', { 
      state: { 
        fromStation: station.name,
        fromMap: true 
      } 
    });
    setSelectedStation(null);
  };

  const handleLayerToggle = (layerId, isActive) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: isActive
    }));
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNavigation />

      {/* Main Content */}
      <div className="relative h-screen pt-16">
        {/* Alert Banner */}
        <div className="absolute top-0 left-0 right-0 z-90 p-4">
          <AlertBanner alerts={mockAlerts} />
        </div>

        {/* Map Search */}
        <div className="absolute top-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-80">
          <MapSearch
            stations={mockStations}
            trains={mockTrains}
            onStationSelect={handleStationSelect}
            onTrainSelect={handleTrainSelect}
          />
        </div>

        {/* Layer Controls */}
        <div className="absolute top-20 right-4 z-80 hidden md:block">
          <LayerControls
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
          />
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-20 md:bottom-4 left-4 z-80">
          <div className="bg-surface rounded-lg shadow-lg border border-border p-3 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-text-secondary">Live</span>
            </div>
            <div className="text-xs text-text-muted">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshData}
              iconName="RefreshCw"
              className="w-6 h-6 p-0 text-text-secondary hover:text-text-primary"
              title="Refresh data"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-20 md:bottom-4 right-4 z-80 flex flex-col space-y-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRoutePanel(true)}
            iconName="Route"
            className="w-12 h-12 p-0 rounded-full shadow-lg"
            title="Plan route"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/public-transit-dashboard')}
            iconName="LayoutDashboard"
            className="w-12 h-12 p-0 rounded-full shadow-lg"
            title="Dashboard"
          />
        </div>

        {/* Map Container */}
        <MapContainer
          trains={activeLayers.trains ? mockTrains : []}
          stations={activeLayers.stations ? mockStations : []}
          selectedTrain={selectedTrain}
          selectedStation={selectedStation}
          onTrainSelect={handleTrainSelect}
          onStationSelect={handleStationSelect}
          userLocation={userLocation}
          mapCenter={mapCenter}
          onMapCenterChange={setMapCenter}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
        />

        {/* Train Popup */}
        <TrainPopup
          train={selectedTrain}
          onClose={handleClosePopups}
          onViewRoute={handleViewRoute}
        />

        {/* Station Popup */}
        <StationPopup
          station={selectedStation}
          onClose={handleClosePopups}
          onPlanRoute={handlePlanRouteFromStation}
        />

        {/* Quick Route Panel */}
        <QuickRoutePanel
          stations={mockStations}
          onPlanRoute={handlePlanRoute}
          onClose={() => setIsRoutePanel(false)}
          isVisible={isRoutePanel}
        />

        {/* Loading Overlay */}
        <LoadingOverlay
          isVisible={isLoading}
          message="Loading live map data..."
          size="lg"
        />
      </div>
    </div>
  );
};

export default InteractiveLiveMap;