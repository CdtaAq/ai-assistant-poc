import React, { useEffect, useState } from "react";

export default function TranscriptPanel() {
  const [text, setText] = useState("");

  useEffect(() => {
    function handler(e) {
      const msg = e.detail;
      if (msg.type === "partial_transcript") setText(msg.text);
      if (msg.type === "final_transcript") setText(msg.text);
    }
    window.addEventListener("assistant-event", handler);
    return () => window.removeEventListener("assistant-event", handler);
  }, []);

  return <div style={{ border: "1px solid gray", padding: "10px" }}>{text}</div>;
}
