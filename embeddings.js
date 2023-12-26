const OpenAI = require("openai");
const openai = new OpenAI(
    api_key = process.env.OPENAI_API_KEY
);

async function getEmbeddings(p) {
    const embeddings = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        encoding_format: "float",
        input: p,

    });
    return embeddings;
}

module.exports = getEmbeddings;