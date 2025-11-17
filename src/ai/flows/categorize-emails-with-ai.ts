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

const categorizeEmailFlow = ai.defineFlow(
  {
    name: 'categorizeEmailFlow',
    inputSchema: CategorizeEmailInputSchema,
    outputSchema: CategorizeEmailOutputSchema,
  },
  async input => {
    const prompt = `You are an AI email categorization expert. Your goal is to categorize emails into one of the following categories:

- Interested: The email indicates interest in a product, service, or opportunity.
- Meeting Booked: The email confirms that a meeting or appointment has been scheduled.
- Not Interested: The email explicitly states a lack of interest or declines an offer.
- Spam: The email is unsolicited, unwanted, and often irrelevant or inappropriate.
- Out of Office: The email is an automated response indicating that the sender is away and unavailable.

Analyze the email below and determine its category. Return ONLY the raw JSON object with the "category" key.

Email body: ${input.emailBody}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:9002', // Replace with your site URL in production
        'X-Title': 'MailWise AI', // Replace with your site title in production
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [{role: 'user', content: prompt}],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenRouter API request failed:', errorBody);
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    const outputText = responseData.choices[0]?.message?.content;

    if (!outputText) {
      console.error("No content in OpenRouter response:", responseData);
      throw new Error("AI returned no content.");
    }
    
    try {
      // The model might return a markdown code block. Let's strip it.
      const cleanedJson = outputText.replace(/```json\n/g, '').replace(/\n```/g, '');
      return CategorizeEmailOutputSchema.parse(JSON.parse(cleanedJson));
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", outputText, e);
      throw new Error("AI returned invalid JSON.");
    }
  }
);
