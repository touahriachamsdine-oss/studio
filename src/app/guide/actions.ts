"use server";

import { generateTouristItinerary, GenerateTouristItineraryInput } from "@/ai/flows/generate-tourist-itinerary";
import { z } from 'zod';

const formSchema = z.object({
  interests: z.string().min(3, "Please enter at least one interest."),
});

export async function getItinerary(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input." };
  }

  const input: GenerateTouristItineraryInput = {
    interests: validatedFields.data.interests,
  };

  try {
    const result = await generateTouristItinerary(input);
    return { success: result.itinerary };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate itinerary. Please try again." };
  }
}
