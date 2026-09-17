# Similarity Search

A Node.js proof-of-concept for semantic search over transcribed audio content using OpenAI embeddings and Pinecone.

## Pipeline

```text
Audio / Video → Whisper → Transcript → Chunking → OpenAI Embeddings → Pinecone → Semantic Query
```

## Features

- Audio transcription with Whisper
- Text chunking for embedding generation
- OpenAI embedding generation
- Vector storage and similarity search with Pinecone
- Node.js-based search workflow

## Tech Stack

Node.js · OpenAI API · Whisper · Pinecone · Axios · UUID

## Configuration

Create a `.env` file from `.env.example`:

```bash
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
```

Never commit credentials or API keys.

## Getting Started

```bash
npm install
node index.js
```

## Project Structure

```text
├── embeddings.js
├── pinecone.js
├── query.js
├── whisper.js
├── index.js
└── .env.example
```

## Status

Proof-of-concept / learning project.
