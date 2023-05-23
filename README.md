With LangChainJS, use the OpenAI language model to ask a question about an article on Wikipedia.

Inspired by https://blog.cloudflare.com/langchain-and-cloudflare and modified the source code to run locally.

To run:

1. `yarn install` or `npm install`.
2. Either create a `.env` file or directly set a environment variable `OPENAI_API_KEY`.
3. Run the main script `node index.js`:
   - if no argument is provided, it will ask the default question: "What is this article about? Can you give me 3 facts about it?"
   - optionally you can provide your question by `node index.js "your question here"`

Thanks,
Calvin C. Chan