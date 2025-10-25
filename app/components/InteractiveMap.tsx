import { useEffect, useRef } from 'react';

interface InteractiveMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export function InteractiveMap({ 
  center = { lat: 41.85, lng: -111.8 }, // Moved slightly more north
  zoom = 9,
  className = "w-full h-96"
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (typeof window.google === 'undefined' || !window.google.maps) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    if (!mapRef.current) return;

    // Initialize the map
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }, { lightness: 17 }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }, { lightness: 18 }]
        },
        {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }, { lightness: 16 }]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#dedede' }, { lightness: 21 }]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
        },
        {
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [{ color: '#fefefe' }, { lightness: 20 }]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
        }
      ]
    });

    // Add a circle to highlight the service area
    const serviceAreaCircle = new window.google.maps.Circle({
      strokeColor: '#dc2626', // Red border
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#dc2626', // Red fill
      fillOpacity: 0.2,
      map: mapInstanceRef.current,
      center: center,
      radius: 50000 // 50km radius to cover the area from Preston, ID to Brigham City, UT
    });

    // Add info window for the service area
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 16px; font-weight: bold;">Stokes Water Well Drilling</h3>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Professional Well Drilling Services</p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Serving Northern Utah & Southern Idaho</p>
        </div>
      `
    });

    // Add click listener to the circle
    serviceAreaCircle.addListener('click', () => {
      infoWindow.setPosition(center);
      infoWindow.open(mapInstanceRef.current);
    });

  }, [center, zoom]);

  return (
    <div className={className}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-lg"
        style={{ minHeight: '256px' }}
      />
    </div>
  );
}

// Declare global Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}
