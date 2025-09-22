// ws/stt-ws.js
// WebSocket handler for /ws/stt
const WebSocket = require('ws');
const { WhisperSession } = require('../ai/whisper-adapter');
const { assistantProcess } = require('../assistant/pipeline');

function attachWSS(server) {
  const wss = new WebSocket.Server({ server, path: '/ws/stt' });

  wss.on('connection', (ws) => {
    console.log('client connected to /ws/stt');
    let whisper = null;

    ws.on('message', async (msg) => {
      // Accept JSON control messages or binary audio frames
      if (typeof msg === 'string') {
        const obj = JSON.parse(msg);
        if (obj.type === 'start') {
          whisper = new WhisperSession();
          whisper.on('partial', p => ws.send(JSON.stringify({ type:'partial_transcript', text: p })));
          whisper.on('final', async (f) => {
            ws.send(JSON.stringify({ type:'final_transcript', text: f.text }));
            // feed to assistant pipeline
            const events = await assistantProcess(f.text);
            for (const ev of events) ws.send(JSON.stringify({ type: 'assistant_event', event: ev }));
          });
        } else if (obj.type === 'audio') {
          // base64 audio chunk
          const buf = Buffer.from(obj.data, 'base64');
          whisper && whisper.sendAudioChunk(buf);
        } else if (obj.type === 'stop') {
          whisper && whisper.end();
        }
      } else {
        // binary audio: send to whisper
        whisper && whisper.sendAudioChunk(msg);
      }
    });

    ws.on('close', () => {
      whisper && whisper.end();
      console.log('client disconnected /ws/stt');
    });
  });
}

module.exports = { attachWSS };
