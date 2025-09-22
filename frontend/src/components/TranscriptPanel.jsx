import React from 'react';

export default function TranscriptPanel({ partial, finals }) {
  return (
    <div>
      <h3>Transcript</h3>
      <div style={{padding:8, border:'1px solid #eee', borderRadius:6, minHeight:200}}>
        <div style={{color:'#999'}}>{partial}</div>
        <hr />
        {finals.slice().reverse().map((t, idx) => (
          <div key={idx} style={{padding:6}}>{t}</div>
        ))}
      </div>
    </div>
  );
}
