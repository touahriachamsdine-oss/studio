"use client";

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { Clock, MapPin } from 'lucide-react';

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const eventsByDate = React.useMemo(() => {
    return events.reduce((acc, event) => {
      const eventDate = new Date(event.date).toDateString();
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
  }, [events]);

  const selectedDayEvents = date ? eventsByDate[date.toDateString()] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0 sm:p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0"
              modifiers={{
                hasEvent: (day) => eventsByDate[day.toDateString()] !== undefined,
              }}
              modifiersStyles={{
                hasEvent: { 
                    position: 'relative',
                    color: 'hsl(var(--primary))',
                    fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {date ? date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length > 0 ? (
              <ul className="space-y-4">
                {selectedDayEvents.map(event => (
                  <li key={event.id} className="p-4 rounded-xl bg-background">
                    <h4 className="font-semibold text-primary">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {event.time}</span>
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {event.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No events for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
