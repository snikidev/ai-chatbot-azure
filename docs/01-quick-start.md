# Quick Start

The chatbot template is a web application built using [Next.js](https://nextjs.org) and the [AI SDK](https://sdk.vercel.ai) that can be used as a starting point for building your own AI applications. The template is designed to be easily customizable and extendable, allowing you to add new features and integrations as needed.

Deploying to [Vercel](https://vercel.com) is the quickest way to get started with the chatbot template, as it automatically sets up the project by connecting to integrations and deploys it to the cloud. You can then later develop the project locally and push changes to the Vercel project.

### Pre-requisites:

- Three LLM models on [Azure AI Foundry](https://ai.azure.com) to start with
- Azure CosmosDB for PostgreSQL
- Azure Blob Storage

### Deploy to Azure

You can deploy your own version of the Next.js AI Chatbot either directly or containerized to a [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview).

`Dockerfile` template is taken from [Next.js example repo](https://github.com/vercel/next.js/tree/canary/examples/with-docker) with a slight modification of updating image to [`node:21-alpine`](https://hub.docker.com/layers/library/node/21-alpine/images/sha256-7364f864dab534a6e982e683813e2a6b1b3cbe86217225dce31aedb75a4c96a3?context=explore)

For quick deployment, you can use the following command:

```bash
docker build -t ai-chatbot-azure .
az acr login --name <myregistry>
docker login <myregistry>.azurecr.io  # get login creds from Settings > Access keys
docker tag ai-chatbot-azure <myregistry>.azurecr.io/ai-chatbot-azure
docker push <myregistry>.azurecr.io/ai-chatbot-azure
```

NOTE: you need to have [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) pre-installed.

Then go to Container App Service and use this image to deploy your AI Chat app.

### Local Development

To develop the chatbot template locally, you can clone the repository, and then create `.env.local`, copy over, and fill in all the environment variables from `.env.example`.

```bash
git clone https://github.com/<username>/<repository>
cd <repository>
pnpm install
```

Then you you can start the development server by running:

```bash
pnpm dev
```

The chatbot template will be available at `http://localhost:3000`.
