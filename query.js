const OpenAI = require("openai");
const openai = new OpenAI((api_key = process.env.OPENAI_API_KEY));
const axios = require("axios");

const getEmbeddings = require("./embeddings");
const { storeEmbeddings, embeddingsArray, upsertRequests } = require("./pinecone");


const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: "299ce0b6-7703-42fa-927f-6a740a0ab4b8",
  environment: "gcp-starter",
});

async function generateTextFromEmbeddings(embeddings) {
  const prompt = `Embeddings: ${embeddings.join(", ")}`;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const generatedText = response.data.choices[0].text.trim();
    console.log("Generated Text:", generatedText);
    return generatedText;
  } catch (error) {
    console.error("Error generating text:", error.message);
    return null;
  }
}

async function querySearch(p) {
  const embeddings = await getEmbeddings(p);
  const index = pinecone.index('openai');

  const search = await index.query({
    vector: embeddings.data[0].embedding,
    topK:2
  })

//   console.log(search.matches[0]);
  console.log(embeddingsArray)
}

module.exports = querySearch;
