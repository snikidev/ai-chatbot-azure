import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const createAzureModels = () => {
  const azureMini = createAzure({
    baseURL: process.env.AZURE_BASE_URL_SMALL,
    apiVersion: process.env.AZURE_API_VERSION_SMALL,
    apiKey: process.env.AZURE_API_KEY,
    // biome-ignore lint: Forbidden non-null assertion.
  })(process.env.AZURE_DEPLOYMENT_NAME_SMALL!);

  const azureLarge = createAzure({
    baseURL: process.env.AZURE_BASE_URL_LARGE,
    apiVersion: process.env.AZURE_API_VERSION_LARGE,
    apiKey: process.env.AZURE_API_KEY,
    // biome-ignore lint: Forbidden non-null assertion.
  })(process.env.AZURE_DEPLOYMENT_NAME_LARGE!);

  const azureReasoning = wrapLanguageModel({
    model: createAzure({
      baseURL: process.env.AZURE_BASE_URL_REASONING,
      apiVersion: process.env.AZURE_API_VERSION_REASONING,
      apiKey: process.env.AZURE_API_KEY,
      // biome-ignore lint: Forbidden non-null assertion.
    })(process.env.AZURE_DEPLOYMENT_NAME_REASONING!),
    middleware: extractReasoningMiddleware({
      tagName: 'think',
    }),
  });

  const azureImage = createAzure({
    baseURL: process.env.AZURE_BASE_URL_IMAGE,
    apiVersion: process.env.AZURE_API_VERSION_IMAGE,
    apiKey: process.env.AZURE_API_KEY,
    // biome-ignore lint: Forbidden non-null assertion.
  }).imageModel(process.env.AZURE_DEPLOYMENT_NAME_IMAGE!);

  return {
    azureMini,
    azureLarge,
    azureReasoning,
    azureImage,
  };
};

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : (() => {
      const { azureMini, azureLarge, azureReasoning, azureImage } =
        createAzureModels();
      return customProvider({
        languageModels: {
          'chat-model': azureLarge,
          'chat-model-reasoning': azureReasoning,
          'title-model': azureMini,
          'artifact-model': azureMini,
        },
        imageModels: {
          'small-model': azureImage,
        },
      });
    })();
