const getEmbeddings = require("./embeddings");
const uuid = require("uuid").v4;

const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: "299ce0b6-7703-42fa-927f-6a740a0ab4b8",
  environment: "gcp-starter",
});

const upsertRequests = [];
const embeddingsArray = [];

async function storeEmbeddings(p) {
  // Define the maximum chunk size (adjust as needed)
  const maxChunkSize = 1000; // You can adjust this based on your requirements

  // Split the text into chunks
  const chunks = [];
  for (let i = 0; i < p.length; i += maxChunkSize) {
    chunks.push(p.substring(i, i + maxChunkSize));
  }

  // Get embeddings for each chunk

  for (const chunk of chunks) {
    const embeddings = await getEmbeddings(chunk);
    embeddingsArray.push(embeddings);
  }



  // Iterate through each embedding and construct upsert request
  for (let i = 0; i < embeddingsArray.length; i++) {
    const embedding = embeddingsArray[i];
    const upsertRequest = {
      id: uuid(),
      values: embedding.data[0].embedding,
    };

    upsertRequests.push(upsertRequest);
  }

  console.log(upsertRequests);
  const index = pinecone.index("openai");

  for (let j = 0; j < upsertRequests.length; j++) {
    console.log(upsertRequests[j]);
  }

  try {
    const upsertResponse = await index.upsert(upsertRequests);
    console.log(upsertResponse);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { storeEmbeddings, embeddingsArray, upsertRequests };
