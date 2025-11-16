
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionary';
import { cn } from '@/lib/utils';
import { updateProfessionalRating } from '@/lib/professionalsData'; // Import the update function
import type { ListedProfessional } from '@/types';

interface RateProfessionalSectionProps {
  professionalId: string;
  professionalName: string;
  dictionary: Dictionary['professionalProfilePage'];
  onRatingSubmitted: (updatedProfessional: ListedProfessional) => void;
}

export default function RateProfessionalSection({
  professionalId,
  professionalName,
  dictionary,
  onRatingSubmitted,
}: RateProfessionalSectionProps) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (role !== 'user') {
    return null; // Only users can rate
  }

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      toast({
        variant: 'destructive',
        title: dictionary.selectARatingPrompt,
      });
      return;
    }
    
    const updatedProfessional = updateProfessionalRating(professionalId, selectedRating);

    if (updatedProfessional) {
      toast({
        title: dictionary.ratingSubmittedSuccess,
      });
      onRatingSubmitted(updatedProfessional); // Notify parent component
      // Optionally reset rating after submission or disable further rating for this session for this pro
      setSelectedRating(0); 
    } else {
      toast({
        variant: 'destructive',
        title: "Error submitting rating", // Consider adding to dictionary
        description: "Could not update professional's rating.",
      });
    }
  };

  return (
    <Card className="mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {dictionary.rateThisProfessional.replace('{name}', professionalName.split(' ')[0])}
        </CardTitle>
        <CardDescription>{dictionary.yourRating}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-1 mb-6 rtl:space-x-reverse">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              key={starValue}
              type="button"
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setSelectedRating(starValue)}
              className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Rate ${starValue} out of 5 stars`}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors duration-150',
                  starValue <= (hoveredRating || selectedRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                )}
              />
            </button>
          ))}
        </div>
        <Button onClick={handleSubmitRating} className="w-full" disabled={selectedRating === 0}>
          {dictionary.submitRatingButton}
        </Button>
      </CardContent>
    </Card>
  );
}
