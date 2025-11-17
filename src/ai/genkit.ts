import {genkit, GenkitError} from 'genkit';
import {defineModel, modelRef, type GenerationCommon} from 'genkit/model';
import {definePlugin, type Plugin} from 'genkit/plugin';

const openRouterPlugin: Plugin = definePlugin(
  {
    name: 'openrouter',
  },
  (options) => {
    return {
      models: [
        defineModel(
          {
            name: 'openrouter/tngtech/deepseek-r1t2-chimera:free',
            label: 'OpenRouter - DeepSeek R1T2 Chimera (Free)',
            supports: {
              multiturn: true,
              tools: false,
              media: false,
              systemRole: true,
            },
            config: {
              apiKey: process.env.OPENROUTER_API_KEY || '',
              model: 'tngtech/deepseek-r1t2-chimera:free',
            },
          },
          async (request, streamer) => {
            const apiKey = request.config?.apiKey;
            if (!apiKey) {
              throw new GenkitError({
                source: 'openrouter-plugin',
                message: 'OpenRouter API key is not configured.',
              });
            }

            const model = request.config?.model || 'tngtech/deepseek-r1t2-chimera:free';
            const messages = request.messages.map(msg => ({
              role: msg.role,
              content: msg.content.map(p => p.text).join('\n'),
            }));

            try {
              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: model,
                  messages: messages,
                  stream: !!streamer,
                }),
              });

              if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorBody}`);
              }

              if (streamer) {
                // Handling streaming response is complex and not fully implemented here
                // This is a placeholder for basic non-streaming functionality
                const data = await response.json();
                if (!data.choices || data.choices.length === 0) {
                  return { candidates: [], usage: {} };
                }
                streamer({
                    index: 0,
                    content: [{ text: data.choices[0].message.content }],
                  });
                return {
                    candidates: [
                        {
                            index: 0,
                            finishReason: 'stop',
                            message: {
                                role: 'model',
                                content: [{ text: data.choices[0].message.content }],
                            },
                        },
                    ],
                    usage: {
                        inputTokens: data.usage.prompt_tokens,
                        outputTokens: data.usage.completion_tokens,
                        totalTokens: data.usage.total_tokens,
                    },
                };

              } else {
                const data = await response.json();
                if (!data.choices || data.choices.length === 0) {
                  return { candidates: [], usage: {} };
                }
                return {
                  candidates: data.choices.map((choice: any, index: number) => ({
                    index,
                    finishReason: choice.finish_reason,
                    message: {
                      role: 'model',
                      content: [{ text: choice.message.content }],
                    },
                  })),
                  usage: {
                    inputTokens: data.usage.prompt_tokens,
                    outputTokens: data.usage.completion_tokens,
                    totalTokens: data.usage.total_tokens,
                  },
                };
              }
            } catch (error) {
              throw new GenkitError({
                source: 'openrouter-plugin',
                cause: error as Error,
              });
            }
          }
        ),
      ]
    }
  }
);


export const ai = genkit({
  plugins: [openRouterPlugin],
});
