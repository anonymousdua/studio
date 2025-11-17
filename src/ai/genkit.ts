import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read from the GOOGLE_GENAI_API_KEY environment variable.
    }),
  ],
  models: [
    {
      name: 'gemini-1.5-flash-latest',
      path: 'googleai/gemini-1.5-flash-latest',
    },
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});
