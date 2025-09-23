// src/components/BrowserSTT.jsx
import React, { useState } from "react";

export default function BrowserSTT() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  let recognition;

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(final + " " + interim);
    };

    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition && recognition.stop();
    setListening(false);
  };

  return (
    <div>
      {listening ? (
        <button onClick={stopListening}>🛑 Stop</button>
      ) : (
        <button onClick={startListening}>🎤 Start</button>
      )}
      <div className="transcript-window">{transcript}</div>
    </div>
  );
}
