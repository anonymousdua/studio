import {
  genkit,
  GenkitError,
  GenerationCommon,
  ModelAction,
  ModelDefinition,
} from 'genkit';
import {genkitPlugin, type Plugin} from 'genkit/plugin';
import {z} from 'zod';
import {MessageData} from 'genkit/ai';
import {CandidateData, Part} from '@genkit/ai/src/types';

// Define the OpenRouter configuration using Zod
const OpenRouterConfigSchema = z.object({
  apiKey: z.string().optional(),
});
type OpenRouterConfig = z.infer<typeof OpenRouterConfigSchema>;

// Define the request schema for the OpenRouter API
const OpenRouterRequestSchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  stream: z.boolean().optional(),
});

// Define the response schema for the OpenRouter API
const OpenRouterResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.string(),
        content: z.string(),
      }),
    })
  ),
});

/**
 * Creates a Genkit plugin for OpenRouter.
 * @param config - The configuration for the OpenRouter plugin.
 * @returns A Genkit plugin instance.
 */
export function openRouter(config: OpenRouterConfig = {}): Plugin<any> {
  const openRouterPlugin = genkitPlugin('openrouter', async () => {
    const apiKey = config.apiKey ?? process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new GenkitError(
        'OpenRouter API key is required. Please provide it in the config or set the OPENROUTER_API_KEY environment variable.'
      );
    }

    const model: ModelAction = {
      name: 'plugins/openrouter/models/openrouter/tngtech/deepseek-r1t2-chimera',
      label: 'OpenRouter - DeepSeek Chimera',
      version: 'free',
      supports: {
        generate: true,
        stream: false,
        tools: false,
        media: false,
      },
      run: async (request, streamingCallback) => {
        const modelName = 'tngtech/deepseek-r1t2-chimera:free';
        const messages = request.messages.map(m => ({
          role: m.role,
          content: m.content[0].text || '',
        }));

        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:9002', // Replace with your site URL in production
              'X-Title': 'MailWise AI', // Replace with your site title in production
            },
            body: JSON.stringify({
              model: modelName,
              messages,
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          throw new GenkitError(
            `OpenRouter API request failed with status ${response.status}: ${errorBody}`
          );
        }

        const responseData = await response.json();
        const parsedResponse =
          OpenRouterResponseSchema.safeParse(responseData);

        if (!parsedResponse.success) {
          throw new GenkitError(
            `Failed to parse OpenRouter response: ${parsedResponse.error.message}`
          );
        }

        const choice = parsedResponse.data.choices[0];
        if (!choice) {
          throw new GenkitError('No choices returned from OpenRouter.');
        }

        // Extract the JSON part if the content is a JSON code block
        let content = choice.message.content;
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          content = jsonMatch[1];
        }

        return {
          candidates: [
            {
              index: 0,
              finishReason: 'stop',
              message: {
                role: 'model',
                content: [{text: content}],
              },
            },
          ],
        };
      },
    };

    return {
      models: [model],
    };
  });
  return openRouterPlugin;
}


export const ai = genkit({
  plugins: [openRouter()],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});
