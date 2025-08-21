"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getItinerary } from '@/app/guide/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  interests: z.string().min(3, {
    message: "Please tell us what you're interested in.",
  }).max(100, {
    message: "Interests must be 100 characters or less.",
  }),
});

export function TouristGuideClient() {
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setItinerary(null);
    setError(null);
    const result = await getItinerary(values);
    if (result.success) {
      setItinerary(result.success);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are your interests?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., historical sites, beaches, local cuisine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="me-2 h-4 w-4" />
                    Generate Itinerary
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Personalized Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {itinerary && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
              {itinerary}
            </div>
          )}
          {!isLoading && !itinerary && !error && (
            <div className="text-center text-muted-foreground h-64 flex flex-col justify-center items-center">
                <Wand2 className="h-12 w-12 mb-4" />
                <p>Your generated itinerary will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
