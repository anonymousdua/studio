import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This file is now simplified to use a standard plugin.
// The custom logic will be handled directly in the flows.

export const ai = genkit({
  plugins: [
    googleAI({
      // We are using a Google AI model as a placeholder,
      // but will be overriding it with OpenRouter in the flows.
    }),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});
