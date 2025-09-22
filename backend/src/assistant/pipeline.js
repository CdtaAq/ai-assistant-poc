// assistant/pipeline.js
const { embedText } = require('../ai/embedding');
const { query } = require('../db');
const { redactPII } = require('../utils/text-utils');

async function assistantProcess(transcript) {
  // 1. Clean / redact
  const cleaned = redactPII(transcript);

  // 2. Embedding + RAG
  const emb = await embedText(cleaned);
  const sql = `SELECT document_id, chunk_text, 1 - (chunk_embedding <#> $1::vector) as similarity FROM doc_chunks ORDER BY chunk_embedding <#> $1::vector LIMIT 3`;
  const res = await query(sql, [emb]);
  const citations = res.rows.map(r => ({
    type: 'kb_citation',
    doc_id: r.document_id,
    snippet: r.chunk_text.slice(0, 300),
    similarity: r.similarity
  }));

  // 3. Simple rule-based suggestions
  const preds = [];
  const lower = cleaned.toLowerCase();
  if (/\brefund\b|\breturn\b|\bchargeback\b|\bcancel\b/.test(lower)) {
    preds.push({ type: 'next_best_action', text: 'Ask for order number and receipt' });
  }
  if (/\bchargeback\b|\blawyer\b|\battorney\b/.test(lower)) {
    preds.push({ type: 'risk_flag', level: 'high', text: 'Mention of chargeback/lawyer — escalate' });
  }

  // 4. Sentiment (naive)
  let sentimentScore = 0;
  if (/[!?]{2,}/.test(cleaned)) sentimentScore -= 0.6;
  if (/\bthank\b|\bthanks\b|\bappreciate\b/.test(lower)) sentimentScore += 0.7;
  const sentiment = { type: 'sentiment', score: sentimentScore, label: sentimentScore >= 0 ? 'positive' : 'negative' };

  return [...citations, ...preds, sentiment];
}

module.exports = { assistantProcess };
