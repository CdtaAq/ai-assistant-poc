// src/components/FakeWhisper.jsx
import React, { useState } from "react";

export default function FakeWhisper() {
  const [transcript, setTranscript] = useState("");
  const fakePhrases = [
    "Hi, I want a refund",
    "for my order number",
    "it was placed last week",
  ];

  const startFake = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fakePhrases.length) {
        setTranscript((prev) => prev + " " + fakePhrases[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div>
      <button onClick={startFake}>🎤 Start Mic (Fake Whisper)</button>
      <div className="transcript-window">{transcript}</div>
    </div>
  );
}
