// utils/text-utils.js
function chunkText(text, maxChars = 1000) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + maxChars);
    out.push(chunk);
    i += maxChars;
  }
  return out;
}

function redactPII(text) {
  // basic redaction: emails, cc-like numbers
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CC]');
}

module.exports = { chunkText, redactPII };
