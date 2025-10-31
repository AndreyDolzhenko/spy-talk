class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    try {
      console.log('🔄 Attempting WebSocket connection...');
      
      // URL подключения - убедитесь что он точь-в-точь как здесь
      const wsUrl = `ws://localhost:3006/`;
      console.log('📡 Connecting to:', wsUrl);
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = (event) => {
        console.log('✅ WebSocket connected successfully!');
        console.log('ReadyState:', this.socket.readyState);
        
        // Отправляем идентификацию после подключения
        this.socket.send(JSON.stringify({
          type: 'identify',
          userId: userId
        }));
      };

      this.socket.onmessage = (event) => {
        console.log('📨 Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket error details:');
        console.error('Error event:', error);
        console.error('Socket readyState:', this.socket?.readyState);
        console.error('Socket URL:', this.socket?.url);
      };

      this.socket.onclose = (event) => {
        console.log('🔌 WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
      };

    } catch (error) {
      console.error('💥 Exception in connect:', error);
    }
  }

  handleMessage(data) {
    console.log('📢 Handling message:', data);
    const { type, payload } = data;
    
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        callback(payload);
      });
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export default new WebSocketService();
