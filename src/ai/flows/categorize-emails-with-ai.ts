'use server';
/**
 * @fileOverview This file defines a Genkit flow for categorizing emails using AI.
 *
 * The flow takes an email as input and categorizes it into one of the following categories:
 * - Interested
 * - Meeting Booked
 * - Not Interested
 * - Spam
 * - Out of Office
 *
 * @exports {categorizeEmail} - An async function that categorizes an email using the categorizeEmailFlow.
 * @exports {CategorizeEmailInput} - The input type for the categorizeEmail function.
 * @exports {CategorizeEmailOutput} - The output type for the categorizeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeEmailInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to categorize.'),
});
export type CategorizeEmailInput = z.infer<typeof CategorizeEmailInputSchema>;

const CategorizeEmailOutputSchema = z.object({
  category: z
    .enum(['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'])
    .describe('The predicted category of the email.'),
});
export type CategorizeEmailOutput = z.infer<typeof CategorizeEmailOutputSchema>;

export async function categorizeEmail(input: CategorizeEmailInput): Promise<CategorizeEmailOutput> {
  return categorizeEmailFlow(input);
}

const categorizeEmailPrompt = ai.definePrompt({
  name: 'categorizeEmailPrompt',
  input: {schema: CategorizeEmailInputSchema},
  output: {schema: CategorizeEmailOutputSchema},
  prompt: `You are an AI email categorization expert. Your goal is to categorize emails into one of the following categories:

- Interested: The email indicates interest in a product, service, or opportunity.
- Meeting Booked: The email confirms that a meeting or appointment has been scheduled.
- Not Interested: The email explicitly states a lack of interest or declines an offer.
- Spam: The email is unsolicited, unwanted, and often irrelevant or inappropriate.
- Out of Office: The email is an automated response indicating that the sender is away and unavailable.

Analyze the email below and determine its category. Return the category in JSON format.

Email body: {{{emailBody}}}`,
});

const categorizeEmailFlow = ai.defineFlow(
  {
    name: 'categorizeEmailFlow',
    inputSchema: CategorizeEmailInputSchema,
    outputSchema: CategorizeEmailOutputSchema,
  },
  async input => {
    const {output} = await categorizeEmailPrompt(input, {
      model: ai.model('gemini-1.5-flash-latest'),
    });
    return output!;
  }
);
