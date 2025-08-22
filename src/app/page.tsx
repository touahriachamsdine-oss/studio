"use client";

import * as React from 'react';
import { EventCard } from '@/components/event-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { events, Event } from '@/lib/data';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState('all');

  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to Mustghanem!"
        description="Discover the vibrant events happening around the city."
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="Art">Art</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Culture">Culture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
            <h3 className="text-xl font-bold tracking-tight text-foreground">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
