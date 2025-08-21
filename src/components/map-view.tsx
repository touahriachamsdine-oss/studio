"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Venue, Event } from '@/lib/types';
import { Button } from './ui/button';

// Fix for default icon not showing in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface MapViewProps {
  venues: Venue[];
  events: Event[];
}

export function MapView({ venues, events }: MapViewProps) {
  const [selectedVenue, setSelectedVenue] = React.useState<Venue | null>(null);

  const center: L.LatLngExpression = [35.9329, 0.0892];

  const eventsAtVenue = (venueId: string) => {
    return events.filter(event => event.venueId === venueId);
  }

  return (
    <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.lat, venue.lng]}
            eventHandlers={{
                click: () => {
                  setSelectedVenue(venue);
                },
              }}
          >
            <Popup>
                <div className="p-1 font-body">
                  <h3 className="font-bold text-lg text-primary">{venue.name}</h3>
                  <p className="text-muted-foreground">{venue.address}</p>
                  <hr className="my-2"/>
                  <h4 className="font-semibold mb-2">Upcoming Events:</h4>
                  <ul className="space-y-2">
                    {eventsAtVenue(venue.id).length > 0 ? (
                      eventsAtVenue(venue.id).map(event => (
                        <li key={event.id} className="text-sm">{event.name}</li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">No upcoming events.</li>
                    )}
                  </ul>
                </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
  );
}