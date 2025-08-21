import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/page-header';
import { venues, events } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const MapView = dynamic(() => import('@/components/map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function MapPage() {
  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Interactive Map"
        description="Find event venues and points of interest across Mostaganem."
      />
      <div className="flex-grow rounded-lg overflow-hidden border">
        <MapView venues={venues} events={events} />
      </div>
    </div>
  );
}
