"use client";
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Card } from './ui/card';
import { useTheme } from 'next-themes';
import { darkModeStyles, lightModeStyles } from '@/constants/contants';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const LocationCard = () => {
  const { theme } = useTheme();
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const city = " Greater Noida, India"; // More accurate

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    scaleControl: false,
    gestureHandling: 'greedy',
    styles: theme === 'dark' ? lightModeStyles : darkModeStyles,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && city) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
          console.log("Geocode status:", status);
          console.log("Geocode results:", results);

          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            setCenter({ lat: location.lat(), lng: location.lng() });
            setMapReady(true);
          } else {
            setError("Could not find coordinates for the specified city.");
          }
        });
      } catch (err) {
        setError("Failed to load map.");
      }
    }
  }, [city]);

  return (
    <Card className="h-full w-full flex flex-col items-center justify-center p-0 m-0 gap-0 overflow-hidden">
      {error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : !mapReady ? (
        <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={mapOptions}
        >
          {/* Ripple effect with multiple circles */}
          {[8, 6, 4, 2].map((r, i) => (
            <Marker
              key={i}
              position={center}
              icon={{
                path: `M 0 0 m -${r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`,
                scale: 1.5,
                fillColor: '#3B82F6',
                fillOpacity: 0.25 * (i + 1),
                strokeColor: i === 3 ? '#FFFFFF' : '#3B82F6',
                strokeWeight: 1,
                strokeOpacity: 0.2 + 0.2 * i,
              }}
            />
          ))}
        </GoogleMap>
      )}
    </Card>
  );
};

export default LocationCard;
