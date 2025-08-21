import { PageHeader } from '@/components/page-header';
import { TouristGuideClient } from '@/components/tourist-guide-client';

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Tourist Guide"
        description="Let our AI craft a personalized itinerary for your visit to Mostaganem based on your interests."
      />
      <TouristGuideClient />
    </div>
  );
}
