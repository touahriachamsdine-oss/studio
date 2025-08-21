'use server';

/**
 * @fileOverview A tourist itinerary generator AI agent.
 *
 * - generateTouristItinerary - A function that generates a personalized tourist itinerary.
 * - GenerateTouristItineraryInput - The input type for the generateTouristItinerary function.
 * - GenerateTouristItineraryOutput - The return type for the generateTouristItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTouristItineraryInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated list of interests for the tourist itinerary, e.g. historical sites, beaches, local cuisine.'),
});
export type GenerateTouristItineraryInput = z.infer<typeof GenerateTouristItineraryInputSchema>;

const GenerateTouristItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A personalized tourist itinerary with suggested routes and points of interest in Mostaganem.'),
});
export type GenerateTouristItineraryOutput = z.infer<typeof GenerateTouristItineraryOutputSchema>;

export async function generateTouristItinerary(input: GenerateTouristItineraryInput): Promise<GenerateTouristItineraryOutput> {
  return generateTouristItineraryFlow(input);
}

const generateTouristItineraryPrompt = ai.definePrompt({
  name: 'generateTouristItineraryPrompt',
  input: {schema: GenerateTouristItineraryInputSchema},
  output: {schema: GenerateTouristItineraryOutputSchema},
  prompt: `You are an expert tourist guide for Mostaganem, Algeria. A tourist has the following interests: {{{interests}}}.  Generate a personalized tourist itinerary with suggested routes and points of interest.  Make sure that the itinerary is well-organized, easy to follow, and includes estimated times for each activity.  The itinerary should also include restaurant recommendations that align with the tourist's interests.`,
});

const generateTouristItineraryFlow = ai.defineFlow(
  {
    name: 'generateTouristItineraryFlow',
    inputSchema: GenerateTouristItineraryInputSchema,
    outputSchema: GenerateTouristItineraryOutputSchema,
  },
  async input => {
    const {output} = await generateTouristItineraryPrompt(input);
    return output!;
  }
);
