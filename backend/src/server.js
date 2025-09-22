// server.js
const Fastify = require('fastify');
const path = require('path');
require('dotenv').config();

const docsRoutes = require('./routes/docs');
const chatRoutes = require('./routes/chat');
const { attachWSS } = require('./ws/stt-ws');
const { attachAssistantWSS } = require('./ws/assistant-ws');

const fastify = Fastify({ logger: true });

// Register routes
fastify.register(docsRoutes);
fastify.register(chatRoutes);

// Start server and then attach raw WebSocket server to the underlying http server
const start = async () => {
  try {
    const address = await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    // attach ws
    attachWSS(fastify.server);
    attachAssistantWSS(fastify.server);
    fastify.log.info(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
