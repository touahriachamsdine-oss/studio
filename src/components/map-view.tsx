"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Venue, Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MapViewProps {
  apiKey: string;
  venues: Venue[];
  events: Event[];
}

export function MapView({ apiKey, venues, events }: MapViewProps) {
  const [selectedVenue, setSelectedVenue] = React.useState<Venue | null>(null);

  const center = { lat: 35.9329, lng: 0.0892 };

  const eventsAtVenue = (venueId: string) => {
    return events.filter(event => event.venueId === venueId);
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="funder_mustghanem_map"
        className="w-full h-full"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {venues.map((venue) => (
          <AdvancedMarker
            key={venue.id}
            position={{ lat: venue.lat, lng: venue.lng }}
            onClick={() => setSelectedVenue(venue)}
          >
            <Pin background={'hsl(var(--primary))'} borderColor={'white'} glyphColor={'white'} />
          </AdvancedMarker>
        ))}
        {selectedVenue && (
          <InfoWindow
            position={{ lat: selectedVenue.lat, lng: selectedVenue.lng }}
            onCloseClick={() => setSelectedVenue(null)}
            minWidth={300}
          >
            <div className="p-2 font-body">
              <h3 className="font-bold text-lg text-primary">{selectedVenue.name}</h3>
              <p className="text-muted-foreground">{selectedVenue.address}</p>
              <hr className="my-2"/>
              <h4 className="font-semibold mb-2">Upcoming Events:</h4>
              <ul className="space-y-2">
                {eventsAtVenue(selectedVenue.id).length > 0 ? (
                  eventsAtVenue(selectedVenue.id).map(event => (
                    <li key={event.id} className="text-sm">{event.name}</li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No upcoming events.</li>
                )}
              </ul>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
