import { PageHeader } from '@/components/page-header';
import { MapClient } from '@/components/map-client';

export default function MapPage() {
  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Interactive Map"
        description="Find event venues and points of interest across Mostaganem."
      />
      <MapClient />
    </div>
  );
}
