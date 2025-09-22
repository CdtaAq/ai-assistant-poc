import React, { useRef, useEffect, useState } from 'react';

// Utility: base64 from ArrayBuffer
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export default function MicStreamer({ wsUrl, onPartial, onFinal, onAssistantEvent }) {
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    wsRef.current = new WebSocket(wsUrl);
    wsRef.current.onopen = () => console.log('ws open');
    wsRef.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'partial_transcript') onPartial?.(msg.text);
        if (msg.type === 'final_transcript') onFinal?.(msg.text);
        if (msg.type === 'assistant_event') onAssistantEvent?.(msg.event);
        if (msg.type === 'assistant_events') {
          msg.events.forEach(ev => onAssistantEvent?.(ev));
        }
      } catch (err) {
        console.warn('ws msg parse error', err);
      }
    };
    return () => {
      wsRef.current && wsRef.current.close();
    };
  }, [wsUrl]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Use MediaRecorder (outputs webm/opus)
    const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    mr.ondataavailable = async (ev) => {
      if (ev.data && ev.data.size > 0) {
        const ab = await ev.data.arrayBuffer();
        // base64 encode and send as JSON
        const base64 = arrayBufferToBase64(ab);
        wsRef.current.send(JSON.stringify({ type: 'audio', data: base64 }));
      }
    };
    mr.start(250); // chunk every 250ms
    mediaRecorderRef.current = mr;
    setStatus('recording');
    wsRef.current.send(JSON.stringify({ type: 'start', sampleRate: 16000, encoding: 'opus' }));
  }

  function stop() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setStatus('idle');
    wsRef.current.send(JSON.stringify({ type: 'stop' }));
  }

  return (
    <div>
      <button onClick={start} disabled={status === 'recording'}>Start Mic</button>
      <button onClick={stop} disabled={status !== 'recording'}>Stop Mic</button>
      <div>Status: {status}</div>
    </div>
  );
}
