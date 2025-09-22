// routes/docs.js
const fs = require('fs');
const pdf = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { embedText } = require('../ai/embedding');
const { chunkText } = require('../utils/text-utils');

async function registerRoutes(fastify) {
  fastify.register(require('fastify-multipart'));

  fastify.post('/docs/upload', async (req, reply) => {
    const parts = req.multipart();
    let fileBuffer = null;
    let filename = 'upload';
    for await (const part of parts) {
      if (part.file) {
        filename = part.filename || filename;
        const chunks = [];
        for await (const chunk of part.file) chunks.push(chunk);
        fileBuffer = Buffer.concat(chunks);
      } else {
        // form fields if any
      }
    }
    if (!fileBuffer) return reply.code(400).send({ error: 'No file uploaded' });

    // If PDF, extract text; if MD treat as raw
    let text = '';
    if (filename.toLowerCase().endsWith('.pdf')) {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else {
      text = fileBuffer.toString('utf8');
    }

    const docId = uuidv4();
    await query('INSERT INTO documents (id, title, source) VALUES ($1, $2, $3)', [docId, filename, filename]);

    const chunks = chunkText(text, 1200);
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const emb = await embedText(c);
      await query('INSERT INTO doc_chunks (document_id, chunk_text, chunk_tokens, chunk_embedding, chunk_order) VALUES ($1,$2,$3,$4,$5)', [docId, c, c.length, emb, i]);
    }
    return { status: 'ok', docId, chunks: chunks.length };
  });
}

module.exports = registerRoutes;
