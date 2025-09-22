const client = require('./openai-client');

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

async function embedText(text) {
  const resp = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text
  });
  // returns array of numbers
  return resp.data[0].embedding;
}

module.exports = { embedText };
