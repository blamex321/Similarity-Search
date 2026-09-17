const OpenAI = require("openai");
const getEmbeddings = require("./embeddings");
const { Pinecone } = require("@pinecone-database/pinecone");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

async function querySearch(p) {
  const embeddings = await getEmbeddings(p);
  const index = pinecone.index("openai");

  const search = await index.query({
    vector: embeddings.data[0].embedding,
    topK: 2,
  });

  return search.matches;
}

module.exports = querySearch;
