import React, { useEffect, useState } from "react";

export default function AssistantPanel() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function handler(e) {
      const msg = e.detail;
      if (msg.type === "assistant_events") {
        setEvents((prev) => [...prev, ...msg.events]);
      }
    }
    window.addEventListener("assistant-event", handler);
    return () => window.removeEventListener("assistant-event", handler);
  }, []);

  return (
    <div style={{ border: "1px solid blue", padding: "10px" }}>
      {events.map((evt, i) => (
        <div key={i}>
          <b>{evt.type}</b>: {evt.text}
        </div>
      ))}
    </div>
  );
}
