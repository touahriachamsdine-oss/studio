"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { venues, events } from '@/lib/data';
import * as React from 'react';

const MapView = dynamic(() => import('@/components/map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapClient() {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    return (
        <div className="flex-grow rounded-lg overflow-hidden border">
            {isClient ? <MapView venues={venues} events={events} /> : <Skeleton className="h-full w-full" />}
        </div>
    );
}
