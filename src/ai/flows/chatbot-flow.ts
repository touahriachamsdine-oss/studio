
'use server';
/**
 * @fileOverview A thiq bi chatbot AI flow.
 *
 * - thiqbiChat - A function that handles chatbot interactions.
 * - ChatbotInput - The input type for the thiqbiChat function.
 * - ChatbotOutput - The return type for the thiqbiChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user_s question or message.'),
  locale: z.string().describe('The current locale of the user (e.g., "en", "fr", "ar").'),
  history: z.array(z.object({
    user: z.string().optional(),
    model: z.string().optional(),
  })).optional().describe('The conversation history.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot_s response to the user.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function thiqbiChat(input: ChatbotInput): Promise<ChatbotOutput> {
  return thiqbiChatFlow(input);
}

const systemPrompt = `You are a friendly and helpful AI assistant for "thiq bi".
"thiq bi" is a platform that connects users with legal professionals. Its tagline is "Your Partner in Trust".
Core services offered through professionals on the platform include:
- Legal Consultations: Expert advice on various legal matters.
- Semi-digital Notarization: Modern and efficient notarization services.
- Commercial Transaction Management: Streamlining business dealings.

"thiq bi" aims to simplify access to legal services, making them more efficient and transparent for everyone. Users can find professionals, and the platform also offers features like secure document management (coming soon) and direct messaging with professionals (planned).
The platform supports English, French, and Arabic.

Your role is to answer questions about "thiq bi":
- What it is and its purpose.
- Services available through professionals on the platform.
- How to use the platform (e.g., finding professionals, registering).
- General information about registration for users and professionals.
- The languages it supports.

Key guidelines:
1. ALWAYS respond in the language of the user's query if you can confidently detect it. Otherwise, use the provided locale: {{locale}}.
2. Be concise, friendly, and helpful.
3. DO NOT PROVIDE LEGAL ADVICE. If a user asks for legal advice, politely state that you are an AI assistant for "thiq bi" and cannot offer legal advice. Instead, suggest they use "thiq bi" to find a qualified professional who can help.
4. If asked about topics outside of "thiq bi" or its services, politely state that your knowledge is focused on "thiq bi" and guide the conversation back to the platform.
5. Do not make up information. If you don't know an answer about a specific "thiq bi" detail not covered here, say that you don't have that specific information but can help with other questions about the platform.
6. You can greet the user and offer to help if they send a generic greeting.
7. Keep your responses relatively short and easy to understand.

The main goal of "thiq bi" is to facilitate the connection between users and legal professionals, acting as a digital intermediary.

CRITICALLY IMPORTANT: Your entire response MUST be a single, valid JSON object. No other text, greetings, or explanations should precede or follow this JSON object.
The JSON object must conform strictly to the following JSON schema:
{{JSONSchema}}
`;

const thiqbiChatPrompt = ai.definePrompt({
  name: 'thiqbiChatPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Explicitly set a model known for good JSON handling
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  system: systemPrompt,
  prompt: (input) => {
    const historyMessages = input.history?.flatMap(h => [
        ...(h.user ? [{role: 'user', content: [{text: h.user}]}] : []),
        ...(h.model ? [{role: 'model', content: [{text: h.model}]}] : [])
    ]) || [];
    return [
        ...historyMessages,
        {role: 'user', content: [{text: input.query}]}
    ];
  },
  config: {
    temperature: 0.3, // Lower temperature for more factual, less creative responses
     safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const thiqbiChatFlow = ai.defineFlow(
  {
    name: 'thiqbiChatFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await thiqbiChatPrompt(input);
    if (!output?.response) {
      // Fallback response if the model doesn't generate anything
      let fallback = "I'm sorry, I couldn't process that. Could you try asking in a different way?";
      if (input.locale === 'fr') fallback = "Désolé, je n'ai pas pu traiter cela. Pourriez-vous essayer de demander différemment ?";
      if (input.locale === 'ar') fallback = "عذرًا، لم أتمكن من معالجة ذلك. هل يمكنك المحاولة بصيغة أخرى؟";
      return { response: fallback };
    }
    return output;
  }
);
