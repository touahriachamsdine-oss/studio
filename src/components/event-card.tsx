import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();

  const handleAddToCalendar = () => {
    toast({
      title: "Event Added to Calendar",
      description: `${event.name} has been added to your calendar.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Badge variant="secondary" className="absolute top-2 start-2 z-10">{event.category}</Badge>
        <Image
          src={event.image}
          alt={event.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={event.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2 truncate">{event.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCalendar} className="w-full bg-accent hover:bg-accent/90">
            <Plus className="me-2 h-4 w-4" /> Add to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
}
