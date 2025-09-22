// routes/chat.js
const { embedText } = require('../ai/embedding');
const { query } = require('../db');
const client = require('../ai/openai-client');

async function registerRoutes(fastify) {
  fastify.post('/chat/ask', async (req, reply) => {
    const { query: qText, top_k = 4 } = req.body;
    if (!qText) return reply.code(400).send({ error: 'query required' });

    const qEmb = await embedText(qText);

    // similarity search — using cosine distance
    const sql = `
      SELECT id, document_id, chunk_text, 1 - (chunk_embedding <#> $1::vector) as similarity
      FROM doc_chunks
      ORDER BY chunk_embedding <#> $1::vector
      LIMIT $2
    `;
    // NOTE: the operator <#> returns cosine distance — operator details depend on pgvector version
    const res = await query(sql, [qEmb, top_k]);
    const docs = res.rows;

    // Compose RAG prompt
    const context = docs.map(d => d.chunk_text).join('\n\n---\n\n');
    const prompt = `Use the following context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${qText}\n\nAnswer concisely and cite any doc snippets by giving a citation with document id.`;
    const completion = await client.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400
    });

    const answer = completion.choices?.[0]?.message?.content || 'No answer';
    return { answer, citations: docs.map(d => ({ id: d.document_id, similarity: d.similarity })) };
  });
}

module.exports = registerRoutes;
