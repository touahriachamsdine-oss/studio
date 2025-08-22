
import { EventCalendar } from '@/components/event-calendar';
import { PageHeader } from '@/components/page-header';
import { events } from '@/lib/data';

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Event Calendar"
        description="Browse events by day, week, or month."
      />
      <EventCalendar events={events} />
    </div>
  );
}
