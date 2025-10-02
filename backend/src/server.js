const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// Simple /chat/ask endpoint for Postman testing
app.post("/chat/ask", (req, res) => {
  const { query } = req.body;
  // Fake response
  res.json({
    answer: `Answer about: ${query}`,
    citations: [{ doc: "RefundPolicy.pdf", snippet: "Refunds take 5–7 days" }]
  });
});

const server = app.listen(3001, () =>
  console.log("Backend listening on http://localhost:3001")
);

// WebSocket server
const wss = new WebSocketServer({ server, path: "/ws/stt" });

wss.on("connection", (ws) => {
  console.log("WS client connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "start") {
      console.log("STT session started");
      // simulate partial + final transcripts
      setTimeout(() => {
        ws.send(JSON.stringify({ type: "partial_transcript", text: "I want a ref" }));
      }, 1000);
      setTimeout(() => {
        ws.send(JSON.stringify({ type: "final_transcript", text: "I want a refund for my order" }));
        ws.send(JSON.stringify({
          type: "assistant_events",
          events: [
            {
              type: "kb_citation",
              text: "Refunds take 5–7 days – Policy, Page 3"
            }
          ]
        }));
      }, 2500);
    }
    if (data.type === "stop") {
      console.log("STT session stopped");
    }
  });
});
