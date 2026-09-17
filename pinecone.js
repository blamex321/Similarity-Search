const getEmbeddings = require("./embeddings");
const uuid = require("uuid").v4;
const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const upsertRequests = [];
const embeddingsArray = [];

async function storeEmbeddings(p) {
  const maxChunkSize = 1000;
  const chunks = [];

  for (let i = 0; i < p.length; i += maxChunkSize) {
    chunks.push(p.substring(i, i + maxChunkSize));
  }

  for (const chunk of chunks) {
    const embeddings = await getEmbeddings(chunk);
    embeddingsArray.push(embeddings);
  }

  for (const embedding of embeddingsArray) {
    upsertRequests.push({
      id: uuid(),
      values: embedding.data[0].embedding,
    });
  }

  const index = pinecone.index("openai");

  try {
    const upsertResponse = await index.upsert(upsertRequests);
    console.log(upsertResponse);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { storeEmbeddings, embeddingsArray, upsertRequests };
