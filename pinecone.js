const mongoose = require('mongoose');
const getEmbeddings = require("./embeddings");
const { Pinecone } = require("@pinecone-database/pinecone");
const uuid = require("uuid").v4;

// MongoDB connection URI
const mongoUri = 'mongodb://localhost:27017/'; // Update with your MongoDB URI

// Define a schema for your documents
const embeddingSchema = new mongoose.Schema({
  _id: String, // Use a string instead of generating a new UUID
  text: String,
  values: [Number],
});

// Create a model based on the schema
const EmbeddingModel = mongoose.model('Embedding', embeddingSchema);

const embeddingsArray = [];
const localEmbeddingsArray = [];

const pinecone = new Pinecone({
  apiKey: "299ce0b6-7703-42fa-927f-6a740a0ab4b8",
  environment: "gcp-starter",
});

const upsertRequests = [];

async function storeEmbeddings(p) {
  const commonUUID = uuid(); // Generate a common UUID for both MongoDB and Pinecone

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

  // Iterate through each embedding and construct localEmbeddingsArray
  for (let i = 0; i < embeddingsArray.length; i++) {
    const embedding = embeddingsArray[i];
    const localEmbedding = {
      _id: commonUUID, // Use the common UUID
      text: chunks[i], // Include the text information
      values: embedding.data[0].embedding,
    };

    localEmbeddingsArray.push(localEmbedding);
  }

  // Connect to MongoDB using Mongoose
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Insert localEmbeddingsArray into MongoDB
    await EmbeddingModel.insertMany(localEmbeddingsArray);

    console.log('Local embeddings stored in MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the Mongoose connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }

  // Connect to Pinecone
  const index = pinecone.index("openai");

  // Construct upsert requests for Pinecone
  for (let i = 0; i < embeddingsArray.length; i++) {
    const embedding = embeddingsArray[i];
    const upsertRequest = {
      id: commonUUID, // Use the common UUID
      values: embedding.data[0].embedding,
    };

    upsertRequests.push(upsertRequest);
  }

  // Upsert data into Pinecone
  try {
    const upsertResponse = await index.upsert(upsertRequests);
    console.log('Data upserted into Pinecone:', upsertResponse);
  } catch (error) {
    console.error('Error upserting data into Pinecone:', error);
  }
}

module.exports = { storeEmbeddings, embeddingsArray, localEmbeddingsArray, upsertRequests };
