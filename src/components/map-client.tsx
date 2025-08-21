"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { venues, events } from '@/lib/data';

const MapView = dynamic(() => import('@/components/map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapClient() {
    return (
        <div className="flex-grow rounded-lg overflow-hidden border">
            <MapView venues={venues} events={events} />
        </div>
    );
}
