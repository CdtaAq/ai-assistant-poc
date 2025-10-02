import React, { useRef, useState, useEffect } from "react";

export default function MicStreamer() {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3001/ws/stt");
    wsRef.current.onopen = () => setConnected(true);
    wsRef.current.onclose = () => setConnected(false);

    wsRef.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const event = new CustomEvent("assistant-event", { detail: msg });
      window.dispatchEvent(event);
    };

    return () => wsRef.current.close();
  }, []);

  const start = () => {
    wsRef.current.send(JSON.stringify({ type: "start" }));
  };
  const stop = () => {
    wsRef.current.send(JSON.stringify({ type: "stop" }));
  };

  return (
    <div>
      <button onClick={start} disabled={!connected}>🎤 Start</button>
      <button onClick={stop} disabled={!connected}>🛑 Stop</button>
    </div>
  );
}
