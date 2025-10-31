require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Sequelize } = require("sequelize");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3006"],
    methods: ["GET", "POST"],
  },
});

// import { WebSocketService } from "./services/websocket";

// Подключение к PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Хранилище подключений по user_id
const userConnections = new Map();

// Middleware должны быть определены ДО маршрутов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Импорт маршрутов ДО их использования
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");

// Подключение маршрутов
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

// Главный маршрут (только один!)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spy Talk</title>
      <link rel="shortcut icon" href="images/spyIcon.png" type="image/x-icon">
      <style>
        body {
          display: flex;
          width: 100%;
          height: 100vh;
          justify-content: center;
          align-items: center;
          background: aliceblue;
        }
        @keyframes scaleAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        .auto-animated-image {
          animation: scaleAnimation 3s ease-in-out;
        }
      </style>
    </head>
    <body>
      <a href="/basePage.html" title="Welcome to Spy Talk!">
        <img src="/images/spy.png" alt="Welcome to Spy Talk!" class="auto-animated-image">
      </a>
    </body>
    </html>
  `);
});

// Настройка Socket.io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", (userId) => {
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId).add(socket.id);
    socket.userId = userId;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    if (socket.userId && userConnections.has(socket.userId)) {
      userConnections.get(socket.userId).delete(socket.id);
      if (userConnections.get(socket.userId).size === 0) {
        userConnections.delete(socket.userId);
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Функция для отправки уведомлений
// const notifyUsers = (userId, event, data) => {
//   if (userConnections.has(userId)) {
//     const sockets = userConnections.get(userId);
//     sockets.forEach((socketId) => {
//       io.to(socketId).emit(event, data);
//     });
//     console.log(
//       `📢 Notification sent to ${sockets.size} clients for user ${userId}`
//     );
//   }
// };

// Проверка подключения к базе данных
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection established successfully");

    // Синхронизация моделей (осторожно в продакшене)
    await sequelize.sync();
    console.log("✅ Database synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    await testConnection();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Обработка непредвиденных ошибок
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

// Экспортируем для использования в других модулях
module.exports = {
  app,
  server,
  io,
  sequelize,
  userConnections,
  // notifyUsers,
};
