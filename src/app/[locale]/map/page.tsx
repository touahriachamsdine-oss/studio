

"use client";

import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import * as React from 'react';

// Dynamically import MapView to ensure it's only rendered on the client side.
const MapView = dynamic(() => import('@/components/map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function MapPage() {
  const [isClient, setIsClient] = React.useState(false);

  // useEffect runs only on the client, so we can safely set isClient to true.
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Interactive Map"
        description="Find event venues and points of interest across Mostaganem."
      />
      <div className="flex-grow rounded-lg overflow-hidden border">
         {isClient ? <MapView /> : <Skeleton className="h-full w-full" />}
      </div>
    </div>
  );
}
