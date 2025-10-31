class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    this.socket = new WebSocket(`ws://localhost:3006/ws?userId=${userId}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    // Вызываем все обработчики для этого типа события
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        callback(payload);
      });
    }
  }

  // Подписка на события
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  // Отписка от событий
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
