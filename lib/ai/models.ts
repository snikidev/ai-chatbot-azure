import { createAzure } from '@ai-sdk/azure';
import { createDeepSeek } from '@ai-sdk/deepseek';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

const azureMini = createAzure({
  baseURL: process.env.AZURE_BASE_URL_SMALL,
  apiVersion: process.env.AZURE_API_VERSION_SMALL,
  apiKey: process.env.AZURE_API_KEY_SMALL,
})(process.env.AZURE_DEPLOYMENT_NAME_SMALL!)

const azureLarge = createAzure({
  baseURL: process.env.AZURE_BASE_URL_LARGE,
  apiVersion: process.env.AZURE_API_VERSION_LARGE,
  apiKey: process.env.AZURE_API_KEY_LARGE,
})(process.env.AZURE_DEPLOYMENT_NAME_LARGE!)

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': azureMini,
    'chat-model-large': azureLarge,
    'chat-model-reasoning': wrapLanguageModel({
      model: createDeepSeek({
        baseURL: process.env.AZURE_BASE_URL_REASONING,
        apiKey: process.env.AZURE_API_KEY_REASONING,
      })(process.env.AZURE_DEPLOYMENT_NAME_REASONING!),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': azureMini,
    'block-model': azureMini,
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'o1',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'DeepSeek R1',
    description: 'Uses advanced reasoning',
  },
];
