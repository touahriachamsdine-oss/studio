"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSuggestions } from '@/app/suggestions/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
    interests: z.string().min(3, {
        message: "Please tell us what you're interested in.",
      }).max(100, {
        message: "Interests must be 100 characters or less.",
      }),
    userInteractions: z.string().optional(),
});

export function PersonalizedSuggestionsClient() {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      userInteractions: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    setError(null);
    const result = await getSuggestions(values);
    if (result.success) {
      setSuggestions(result.success);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Tell Us About You</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., history, food, architecture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInteractions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Activity (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Saved Fête de la Sardine event', 'Visited Théâtre Régional'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    Finding Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="me-2 h-4 w-4" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Personalized Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {suggestions && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
              {suggestions}
            </div>
          )}
          {!isLoading && !suggestions && !error && (
            <div className="text-center text-muted-foreground h-64 flex flex-col justify-center items-center">
                <Sparkles className="h-12 w-12 mb-4" />
                <p>Your personalized suggestions will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
