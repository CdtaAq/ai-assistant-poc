import React, { useState } from 'react';
import MicStreamer from './components/MicStreamer';
import TranscriptPanel from './components/TranscriptPanel';
import AssistantPanel from './components/AssistantPanel';
import UploadDoc from './components/UploadDoc';

export default function App() {
  const [partial, setPartial] = useState('');
  const [finals, setFinals] = useState([]);
  const [events, setEvents] = useState([]);

  return (
    <div className="app">
      <header><h2>Real-Time AI Assistant (POC)</h2></header>
      <div className="controls">
        <UploadDoc />
        <MicStreamer
          wsUrl="ws://localhost:3000/ws/stt"
          onPartial={(t) => setPartial(t)}
          onFinal={(t) => setFinals(prev => [...prev, t])}
          onAssistantEvent={(ev) => setEvents(prev => [ev, ...prev])}
        />
      </div>
      <main className="panels">
        <TranscriptPanel partial={partial} finals={finals} />
        <AssistantPanel events={events} />
      </main>
    </div>
  );
}
