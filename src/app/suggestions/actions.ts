"use server";

import { personalizePoiSuggestions, PersonalizePoiSuggestionsInput } from "@/ai/flows/personalize-poi-suggestions";
import { z } from 'zod';

const formSchema = z.object({
  interests: z.string().min(3, "Please enter at least one interest."),
  userInteractions: z.string().optional(),
});

export async function getSuggestions(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input." };
  }

  const input: PersonalizePoiSuggestionsInput = {
    interests: validatedFields.data.interests,
    userInteractions: validatedFields.data.userInteractions || "No specific interactions logged.",
  };

  try {
    const result = await personalizePoiSuggestions(input);
    return { success: result.suggestions };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate suggestions. Please try again." };
  }
}
