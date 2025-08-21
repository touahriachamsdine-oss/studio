
"use client";

import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Venue, Event } from '@/lib/types';
import { venues, events } from '@/lib/data';

// Fix for default icon not showing in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MAP_CONTAINER_ID = 'leaflet-map-container';

export function MapView() {
  const mapInstance = useRef<L.Map | null>(null);
  const center: L.LatLngExpression = [35.9329, 0.0892];

  const eventsAtVenue = (venueId: string) => {
    return events.filter(event => event.venueId === venueId);
  }

  useEffect(() => {
    // Only initialize the map if the container exists and there's no map instance yet.
    if (document.getElementById(MAP_CONTAINER_ID) && !mapInstance.current) {
      const map = L.map(MAP_CONTAINER_ID).setView(center, 13);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      venues.forEach((venue) => {
        const popupContent = `
          <div class="p-1 font-body">
            <h3 class="font-bold text-lg text-primary">${venue.name}</h3>
            <p class="text-muted-foreground">${venue.address}</p>
            <hr class="my-2"/>
            <h4 class="font-semibold mb-2">Upcoming Events:</h4>
            <ul class="space-y-2">
              ${
                eventsAtVenue(venue.id).length > 0
                  ? eventsAtVenue(venue.id)
                      .map((event) => `<li class="text-sm">${event.name}</li>`)
                      .join('')
                  : '<li class="text-sm text-muted-foreground">No upcoming events.</li>'
              }
            </ul>
          </div>
        `;
        
        L.marker([venue.lat, venue.lng])
          .addTo(map)
          .bindPopup(popupContent);
      });
    }

    // Cleanup function to remove the map instance when the component unmounts.
    // This is crucial for preventing the error in development.
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center]); // Only re-run if center changes.

  return (
    <div id={MAP_CONTAINER_ID} className="w-full h-full" />
  );
}
