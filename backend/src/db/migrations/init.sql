-- init.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  source text,
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doc_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text text,
  chunk_tokens int,
  chunk_embedding vector(1536),
  chunk_order int,
  created_at timestamptz DEFAULT now()
);

-- ivfflat index for pgvector (requires appropriate pgvector settings)
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding ON doc_chunks USING ivfflat (chunk_embedding vector_cosine_ops) WITH (lists = 100);
