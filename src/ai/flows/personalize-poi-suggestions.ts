'use server';

/**
 * @fileOverview A flow that provides personalized suggestions for points of interest and routes based on user preferences.
 *
 * - personalizePoiSuggestions - A function that handles the process of generating personalized POI suggestions.
 * - PersonalizePoiSuggestionsInput - The input type for the personalizePoiSuggestions function.
 * - PersonalizePoiSuggestionsOutput - The return type for the personalizePoiSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizePoiSuggestionsInputSchema = z.object({
  userInteractions: z
    .string()
    .describe(
      'A string containing a log of the users interactions with the app, including events they have attended, places they have saved, and any other relevant actions.'
    ),
  interests: z
    .string()
    .describe(
      'A comma separated list of user interests such as history, food, architecture, etc.'
    ),
});
export type PersonalizePoiSuggestionsInput = z.infer<
  typeof PersonalizePoiSuggestionsInputSchema
>;

const PersonalizePoiSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of personalized suggestions for points of interest and routes in Mostaganem, tailored to the users preferences.'
    ),
});
export type PersonalizePoiSuggestionsOutput = z.infer<
  typeof PersonalizePoiSuggestionsOutputSchema
>;

export async function personalizePoiSuggestions(
  input: PersonalizePoiSuggestionsInput
): Promise<PersonalizePoiSuggestionsOutput> {
  return personalizePoiSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizePoiSuggestionsPrompt',
  input: {schema: PersonalizePoiSuggestionsInputSchema},
  output: {schema: PersonalizePoiSuggestionsOutputSchema},
  prompt: `You are a tourist guide expert in Mostaganem.

  Based on the user's past interactions and their stated interests, provide a list of personalized suggestions for points of interest and routes.

  User Interactions: {{{userInteractions}}}
  Interests: {{{interests}}}

  Suggestions:`,
});

const personalizePoiSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizePoiSuggestionsFlow',
    inputSchema: PersonalizePoiSuggestionsInputSchema,
    outputSchema: PersonalizePoiSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
