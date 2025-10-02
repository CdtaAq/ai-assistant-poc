import React from "react";
import TranscriptPanel from "./components/TranscriptPanel";
import AssistantPanel from "./components/AssistantPanel";
import MicStreamer from "./components/MicStreamer";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div>
        <h2>Transcript</h2>
        <MicStreamer />
        <TranscriptPanel />
      </div>
      <div>
        <h2>Assistant Panel</h2>
        <AssistantPanel />
      </div>
    </div>
  );
}
