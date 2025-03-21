import { createAzure } from '@ai-sdk/azure';
import { createDeepSeek } from '@ai-sdk/deepseek';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const azureMini = createAzure({
  baseURL: process.env.AZURE_BASE_URL_SMALL,
  apiVersion: process.env.AZURE_API_VERSION_SMALL,
  apiKey: process.env.AZURE_API_KEY_SMALL,
})(process.env.AZURE_DEPLOYMENT_NAME_SMALL);

const azureLarge = createAzure({
  baseURL: process.env.AZURE_BASE_URL_LARGE,
  apiVersion: process.env.AZURE_API_VERSION_LARGE,
  apiKey: process.env.AZURE_API_KEY_LARGE,
})(process.env.AZURE_DEPLOYMENT_NAME_LARGE);

const imageModel = createAzure({
  baseURL: process.env.AZURE_BASE_URL_IMAGE,
  apiVersion: process.env.AZURE_API_VERSION_IMAGE,
  apiKey: process.env.AZURE_API_KEY_IMAGE,
}).imageModel(process.env.AZURE_DEPLOYMENT_NAME_IMAGE);

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model-small': azureMini,
        'chat-model-large': azureLarge,
        'chat-model-reasoning': wrapLanguageModel({
          model: createDeepSeek({
            baseURL: process.env.AZURE_BASE_URL_REASONING,
            apiKey: process.env.AZURE_API_KEY_REASONING,
          })(process.env.AZURE_DEPLOYMENT_NAME_REASONING),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': azureMini,
        'artifact-model': azureMini,
      },
      imageModels: {
        'small-model': imageModel,
      },
    });
