import React from 'react';

export default function AssistantPanel({ events }) {
  return (
    <div>
      <h3>Assistant</h3>
      <div>
        {events.map((ev, i) => (
          <div key={i} className={`event ${ev.type === 'kb_citation' ? 'kb' : ev.type === 'risk_flag' ? 'risk' : 'next'}`}>
            <strong>{ev.type}</strong> — {ev.text || ev.snippet || JSON.stringify(ev)}
            {ev.doc_id ? <div style={{fontSize:12, color:'#666'}}>doc: {ev.doc_id} • sim: {ev.similarity?.toFixed?.(2)}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
