const numbers = [];
const alfabeth = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let result = "";

    for (let index = 0; index < 2; index++) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        const numIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        const element = num + alfabeth[numIndex];
        result += element;
    }    

    return result;
}

const colors = ['green', 'blue', 'brown', 'orange', 'teal', 'purple', 'pink'];

///// WebSocketService

// class WebSocketService {
//   constructor() {
//     this.socket = null;
//     this.listeners = new Map();
//     this.reconnectAttempts = 0;
//     this.maxReconnectAttempts = 5;
//   }

//   connect(userId) {
//     try {
//       console.log(`🔄 Подключаемся к WebSocket для пользователя ${userId}...`);
      
//       // URL WebSocket
//       const wsUrl = `ws://localhost:3005/ws?userId=${userId}`;
//       console.log('📡 URL подключения:', wsUrl);
      
//       this.socket = new WebSocket(wsUrl);
      
//       this.socket.onopen = () => {
//         console.log('✅ WebSocket успешно подключен');
//         this.reconnectAttempts = 0;
//       };

//       this.socket.onmessage = (event) => {
//         console.log('📨 Получено сообщение:', event.data);
//         try {
//           const data = JSON.parse(event.data);
//           this.handleMessage(data);
//         } catch (error) {
//           console.error('❌ Ошибка парсинга сообщения:', error);
//         }
//       };

//       this.socket.onerror = (error) => {
//         console.error('❌ Ошибка WebSocket:', error);
//       };

//       this.socket.onclose = (event) => {
//         console.log('🔌 WebSocket отключен:', {
//           code: event.code,
//           reason: event.reason,
//           wasClean: event.wasClean
//         });

//         if (this.reconnectAttempts < this.maxReconnectAttempts) {
//           this.reconnectAttempts++;
//           console.log(`🔄 Переподключение... Попытка ${this.reconnectAttempts}`);
//           setTimeout(() => this.connect(userId), 2000);
//         }
//       };

//     } catch (error) {
//       console.error('💥 Ошибка создания WebSocket:', error);
//     }
//   }

//   handleMessage(data) {
//     const { type, payload } = data;
//     console.log(`📢 Обработка события: ${type}`, payload);
    
//     if (this.listeners.has(type)) {
//       this.listeners.get(type).forEach(callback => {
//         callback(payload);
//       });
//     }
//   }

//   on(eventType, callback) {
//     if (!this.listeners.has(eventType)) {
//       this.listeners.set(eventType, []);
//     }
//     this.listeners.get(eventType).push(callback);
//   }

//   off(eventType, callback) {
//     if (this.listeners.has(eventType)) {
//       const callbacks = this.listeners.get(eventType);
//       const index = callbacks.indexOf(callback);
//       if (index > -1) {
//         callbacks.splice(index, 1);
//       }
//     }
//   }
// }

////////////////////////////////////////////////////

// class WebSocketService {
//   constructor() {
//     this.socket = null;
//     this.listeners = new Map();
//   }

//   connect(userId) {
//     this.socket = new WebSocket(`ws://localhost:3005/ws?userId=${userId}`);
    
//     this.socket.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     this.socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       this.handleMessage(data);
//     };

//     this.socket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };
//   }

//   handleMessage(data) {
//     const { type, payload } = data;
    
//     // Вызываем все обработчики для этого типа события
//     if (this.listeners.has(type)) {
//       this.listeners.get(type).forEach(callback => {
//         callback(payload);
//       });
//     }
//   }

//   // Подписка на события
//   on(eventType, callback) {
//     if (!this.listeners.has(eventType)) {
//       this.listeners.set(eventType, []);
//     }
//     this.listeners.get(eventType).push(callback);
//   }

//   // Отписка от событий
//   off(eventType, callback) {
//     if (this.listeners.has(eventType)) {
//       const callbacks = this.listeners.get(eventType);
//       const index = callbacks.indexOf(callback);
//       if (index > -1) {
//         callbacks.splice(index, 1);
//       }
//     }
//   }
// }
