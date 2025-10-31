// minimal-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3005 });
console.log('🔄 Trying to start on port 3005...');

wss.on('connection', (ws) => {
  console.log('✅ CONNECTED!');
  ws.send('Hello from server!');
});

wss.on('listening', () => {
  console.log('✅ Server listening on port 3005');
});

wss.on('error', (err) => {
  console.log('❌ Server error:', err.message);
});
