/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import dotenv from "dotenv";
import { RetrievalQAChain } from "langchain/chains";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default async function main(question) {
  const env = process.env;
  const loader = new CheerioWebBaseLoader("https://en.wikipedia.org/wiki/Brooklyn");
  const docs = await loader.loadAndSplit();

  const store = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY}));

  const model = new OpenAI({ openAIApiKey: env.OPENAI_API_KEY });
  const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

  const res = await chain.call({
    query: question
  });
  console.log("Answer:");
  console.log(res.text);
}

(async () => {
  dotenv.config();
  const [, , ...tokens] = process.argv;
  const question = tokens.join(" ");
  const query = question || "What is this article about? Can you give me 3 facts about it?";
  console.log(`Question: ${query}`);
  await main(query).finally(() => {
    console.log("Done")
  });
})();
