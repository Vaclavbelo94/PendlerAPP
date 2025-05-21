
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPinned, Navigation, Locate } from 'lucide-react';

const MAPBOX_TOKEN_PLACEHOLDER = "pk.your_mapbox_token_here";

const CommuterMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get token from localStorage
    return localStorage.getItem('mapbox_token') || '';
  });
  const [tokenInput, setTokenInput] = useState(mapboxToken);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
    }
  }, [mapboxToken]);

  // Initialize map when container is available and token is set
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [12.5, 50], // Default center on Czech/German border region
        zoom: 6,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add scale
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      // Add the pendler popular routes (simplified demo data)
      map.current.on('load', () => {
        if (!map.current) return;
        
        // Example route
        map.current.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [12.4, 50.1], // Karlovy Vary region
                [12.1, 50.15], // Cheb
                [11.9, 50.2], // Towards Germany
                [11.7, 50.3], // Germany
              ]
            }
          }
        });
        
        map.current.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

        // Add some example points of interest
        const pointsOfInterest = [
          {
            name: 'Dresden',
            coordinates: [13.7373, 51.0504] as [number, number],
            description: 'Populární cíl pendlerů z ČR',
          },
          {
            name: 'Mnichov',
            coordinates: [11.5819, 48.1351] as [number, number],
            description: 'Významné ekonomické centrum',
          },
          {
            name: 'Praha',
            coordinates: [14.4378, 50.0755] as [number, number],
            description: 'Výchozí bod mnoha pendlerů',
          }
        ];

        pointsOfInterest.forEach(point => {
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '25px';
          el.style.height = '25px';
          el.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/marker.png)';
          el.style.backgroundSize = 'cover';
          el.style.cursor = 'pointer';

          // Add popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${point.name}</h3><p>${point.description}</p>`);

          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat(point.coordinates)
            .setPopup(popup)
            .addTo(map.current);
        });
      });

      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapContainer, mapboxToken, mapInitialized]);

  // Function to get user location
  const handleGetLocation = () => {
    if (!map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        map.current?.flyTo({
          center: [longitude, latitude],
          essential: true,
          zoom: 10
        });

        // Add or update marker for user location
        const el = document.createElement('div');
        el.className = 'your-location-marker';
        el.style.width = '25px';
        el.style.height = '25px';
        el.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/user-location.png)';
        el.style.backgroundSize = 'cover';

        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Vaše poloha</h3>'))
          .addTo(map.current);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Nepodařilo se získat vaši polohu. Zkontrolujte, zda máte povolenou geolokaci.');
      }
    );
  };

  // Handle saving the token
  const handleSaveToken = () => {
    setMapboxToken(tokenInput);
    window.location.reload();
  };

  // Function to fly to the Czech-German border region
  const handleFlyToBorder = () => {
    map.current?.flyTo({
      center: [12.5, 50.1],
      zoom: 7,
      essential: true
    });
  };

  if (!mapboxToken) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Nastavení Mapbox Token</h2>
        <p className="mb-4">
          Pro zobrazení interaktivní mapy je potřeba zadat váš Mapbox Token. 
          Můžete jej získat zdarma na <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
        </p>
        <div className="flex flex-col gap-4">
          <Input 
            placeholder="Zadejte váš Mapbox token" 
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <Button onClick={handleSaveToken} disabled={!tokenInput}>Uložit token</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleGetLocation}
          className="flex items-center gap-1"
        >
          <Locate className="h-4 w-4" />
          Moje poloha
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleFlyToBorder}
          className="flex items-center gap-1"
        >
          <Navigation className="h-4 w-4" />
          Příhraniční oblast
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMapboxToken('')}
          className="ml-auto"
        >
          Změnit Mapbox token
        </Button>
      </div>
    
      <div 
        ref={mapContainer} 
        className="w-full h-[60vh] md:h-[70vh] rounded-lg shadow-md border border-border"
      />
      
      <div className="text-sm text-muted-foreground">
        <p>
          <MapPinned className="inline h-4 w-4 mr-1" />
          Klikněte na značky na mapě pro zobrazení detailů o dané lokaci.
        </p>
      </div>
    </div>
  );
};

export default CommuterMap;
