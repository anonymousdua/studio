'use server';

/**
 * @fileOverview Generates suggested email replies based on email content and user's product/outreach agenda using RAG.
 *
 * - generateSuggestedReplies - A function that generates suggested replies for an email.
 * - GenerateSuggestedRepliesInput - The input type for the generateSuggestedReplies function.
 * - GenerateSuggestedRepliesOutput - The return type for the generateSuggestedReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define schemas for input and output
const GenerateSuggestedRepliesInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to reply to.'),
  productAgenda: z.string().describe('The stored product and outreach agenda data.'),
});
export type GenerateSuggestedRepliesInput = z.infer<typeof GenerateSuggestedRepliesInputSchema>;

const GenerateSuggestedRepliesOutputSchema = z.object({
  suggestedReply: z.string().describe('The AI-generated suggested reply for the email.'),
});
export type GenerateSuggestedRepliesOutput = z.infer<typeof GenerateSuggestedRepliesOutputSchema>;

// Define the main function
export async function generateSuggestedReplies(
  input: GenerateSuggestedRepliesInput
): Promise<GenerateSuggestedRepliesOutput> {
  return generateSuggestedRepliesFlow(input);
}

// Define the flow
const generateSuggestedRepliesFlow = ai.defineFlow(
  {
    name: 'generateSuggestedRepliesFlow',
    inputSchema: GenerateSuggestedRepliesInputSchema,
    outputSchema: GenerateSuggestedRepliesOutputSchema,
  },
  async input => {
     const llmResponse = await ai.generate({
      model: 'openrouter/tngtech/deepseek-r1t2-chimera',
      prompt: {
        role: 'user',
        content: [
          {
            text: `You are an AI assistant designed to suggest replies to emails based on their content and a provided product/outreach agenda.

Given the following email content:

${input.emailContent}

And the following product/outreach agenda:

${input.productAgenda}

Generate a concise and relevant reply suggestion. If the email asks for a meeting, and the product agenda contains a booking link, then incorporate that link into the response. Return ONLY the raw JSON object with the "suggestedReply" key.`,
          },
        ],
      },
      output: {
        schema: GenerateSuggestedRepliesOutputSchema,
      },
    });

    const outputText = llmResponse.text();
    try {
      // The model might return a markdown code block. Let's strip it.
      const cleanedJson = outputText.replace(/```json\n/g, '').replace(/\n```/g, '');
      const parsed = JSON.parse(cleanedJson);
      return { suggestedReply: parsed.suggestedReply };
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", outputText);
      // As a fallback, if parsing fails, return the raw text.
      return { suggestedReply: outputText };
    }
  }
);
