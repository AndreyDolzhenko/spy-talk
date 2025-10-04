require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./models"); // Sequelize инстанс импортируется из папки models
const app = express();

app.use(express.json()); // для парсинга application/json
app.use(express.urlencoded({ extended: true })); // для парсинга application/x-www-form-urlencoded

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, "public")));

// Главное меню (стартовая страница)
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
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}

.auto-animated-image {
    animation: scaleAnimation 3s ease-in-out;
}
      </style>


    </head>

  <body>
    
    <a href="/basePage.html" title="Welcome to Spy Talk!"><img src="/images/spy.png" alt="Welcome to Spy Talk!" class="auto-animated-image"></a>

    
    
  `);
});

const PORT = process.env.PORT || 3005;

app.get("/", (req, res) => {
  res.send("API для домашней библиотеки работает!");
});

const userRoutes = require('./routes/user.routes')
app.use('/api/users', userRoutes);

const conversationRoutes = require('./routes/conversation.routes')
app.use('/api/conversations', conversationRoutes);

// const genreRoutes = require('./routes/genre.routes')
// app.use('/api/genres', genreRoutes);

app.listen(PORT, async () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных успешно установлено.");
  } catch (error) {
    console.error("Не удалось подключиться к базе данных:", error);
  }
});
