import { createAzure } from '@ai-sdk/azure';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

const azureMini = createAzure({
  baseURL: process.env.AZURE_BASE_URL_MINI,
  apiVersion: process.env.AZURE_API_VERSION_MINI,
  apiKey: process.env.AZURE_API_KEY_MINI,
})('gpt-4o-mini')

const azureLarge = createAzure({
  baseURL: process.env.AZURE_BASE_URL_LARGE,
  apiVersion: process.env.AZURE_API_VERSION_LARGE,
  apiKey: process.env.AZURE_API_KEY_LARGE,
})('o1')

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': azureMini,
    'chat-model-large': azureLarge,
    'chat-model-reasoning': wrapLanguageModel({
      model: createAzure({
        baseURL: process.env.AZURE_BASE_URL_REASONING,
        apiKey: process.env.AZURE_API_KEY_REASONING,
      })('DeepSeek-R1-eaxir'),
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
