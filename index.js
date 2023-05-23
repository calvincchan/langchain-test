/**
 * To run:
 *
 * 1. yarn install or npm install.
 * 2. Either create a .env file or directly set a environment variable OPENAI_API_KEY.
 * 3. Run the main script node index.js:
 * - if no argument is provided, it will ask the default question: "What is this article about? Can you give me 3 facts about it?"
 * - optionally you can provide your question by node index.js "your question here"
 *
 * Thanks,
 * Calvin C. Chan
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
