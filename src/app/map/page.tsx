import { MapView } from '@/components/map-view';
import { PageHeader } from '@/components/page-header';
import { venues, events } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="space-y-8">
        <PageHeader title="Interactive Map" />
        <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertTitle>Google Maps API Key Missing</AlertTitle>
            <AlertDescription>
            Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable to display the map.
            You can get a key from the Google Cloud Console.
            </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Interactive Map"
        description="Find event venues and points of interest across Mostaganem."
      />
      <div className="flex-grow rounded-lg overflow-hidden border">
        <MapView apiKey={apiKey} venues={venues} events={events} />
      </div>
    </div>
  );
}
