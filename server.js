// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ 
  port: 3006
});

console.log('🚀 WebSocket Server started on ws://localhost:3006');
console.log('📡 Waiting for connections...');

wss.on('connection', function connection(ws, request) {
  console.log('✅ NEW CLIENT CONNECTED!');
  console.log('📡 Client URL:', request.url);
  console.log('📍 Remote Address:', request.socket.remoteAddress);
  
  // Немедленно отправляем сообщение клиенту
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to WebSocket server!',
    timestamp: new Date().toISOString()
  }));

  console.log('📤 Sent welcome message to client');

  ws.on('message', function message(data) {
    console.log('📨 Received from client:', data.toString());
    
    // Отвечаем клиенту
    ws.send(JSON.stringify({
      type: 'echo', 
      message: 'Server received: ' + data.toString(),
      timestamp: new Date().toISOString()
    }));
  });

  ws.on('close', function close() {
    console.log('🔌 Client disconnected');
  });

  ws.on('error', function error(err) {
    console.error('❌ Client connection error:', err);
  });
});

wss.on('error', function error(err) {
  console.error('❌ Server error:', err);
});