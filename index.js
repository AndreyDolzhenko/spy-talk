require("dotenv").config();
const express = require("express");
const http = require("http");
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const { sequelize } = require("./models");
const { Conversation } = require("./models");

const app = express();
const server = http.createServer(app);

app.set("trust proxy", true); // get ip address

// Middleware - ВАЖНО: РАСКОММЕНТИРУЙТЕ ЭТУ СТРОКУ!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // ← УБЕРИТЕ КОММЕНТАРИЙ!

// Импорт маршрутов
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");

// Подключение маршрутов
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

// User Agent

app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  console.log('User Agent:', userAgent);
  req.userAgent = userAgent;
  next();
});

// Добавьте для отладки
app.get("/debug-files", (req, res) => {
  const fs = require("fs");
  const publicPath = path.join(__dirname, "public");

  try {
    const files = fs.readdirSync(publicPath);
    const images = fs.readdirSync(path.join(publicPath, "images"));

    res.json({
      publicPath,
      files,
      images,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

/// Server-Sent Events (SSE) - ИСПРАВЛЕННАЯ ВЕРСИЯ

app.get("/events/:user_id", async (req, res) => {
  // Устанавливаем заголовки для SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Флаг для отслеживания состояния соединения
  let isConnected = true;

  // Функция для безопасной отправки данных
  const sendEvent = (data) => {
    if (!isConnected) return;

    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);

      // Обработка буферизации (для Node.js)
      if (res.flush) {
        res.flush();
      }
    } catch (error) {
      console.error("Error sending SSE:", error);
      isConnected = false;
    }
  };

  // Отправляем начальное сообщение
  sendEvent({ type: "connected", message: "SSE connected" });

  const getAmountMessage = async () => {
    if (!isConnected) return;

    try {
      const conversations = await Conversation.findAll({
        where: {
          user_id: req.params.user_id,
        },
        order: [["createdAt", "DESC"]],
      });

      // Отправляем данные в правильном формате
      sendEvent(conversations.length);
    } catch (error) {
      console.error("Error in SSE:", error);
      sendEvent({
        type: "error",
        message: "Internal server error",
      });
    }
  };

  // Вызываем сразу и затем каждые 3 секунды
  getAmountMessage();
  const intervalId = setInterval(getAmountMessage, 3000);

  // Обработчики событий соединения
  req.on("close", () => {
    console.log("SSE connection closed for user:", req.params.user_id);
    isConnected = false;
    clearInterval(intervalId);
  });

  req.on("end", () => {
    console.log("SSE connection ended for user:", req.params.user_id);
    isConnected = false;
    clearInterval(intervalId);
  });

  req.on("error", (error) => {
    console.error("SSE connection error:", error);
    isConnected = false;
    clearInterval(intervalId);
  });

  // Периодическая отправка ping для поддержания соединения
  const pingInterval = setInterval(() => {
    if (isConnected) {
      sendEvent({ type: "ping", timestamp: new Date().toISOString() });
    } else {
      clearInterval(pingInterval);
    }
  }, 30000); // Каждые 30 секунд

  // Очистка при разрыве
  req.on("close", () => {
    clearInterval(intervalId);
    clearInterval(pingInterval);
  });
});

// Главный маршрут
app.get("/", (req, res) => {
  const ip = req.ip; // получаем ip

  // Санитизация IP для безопасной вставки в HTML
  const safeIP = ip.replace(/[<>&"']/g, "");

  console.log("!!! req.ip: !!! ", ip);

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
        #myIp {
        position: absolute;
        top: 2em;
        left: 1em;
        font-size: 24px;
        font-weight: 300;
        display: inline-block;
        letter-spacing: 2px;
        font-family: Arial, Helvetica, sans-serif;
        color: darkgrey;
        box-sizing: border-box;
        animation: spotlight 4s linear infinite alternate;
        }       

        @keyframes spotlight {
          0% , 20% {
            opacity: 1;
            letter-spacing: 2px;
           }
         80% , 100% {
            opacity: 0;
            letter-spacing: 5px;
           }
        }
      </style>
    </head>
    <body>
    <!--<a id="myIp" href="/basePage.html">мои сессии</a> -->
      <a id="mainEnter" href="/basePage.html" title="Welcome to Spy Talk!">
        <img src="/images/spy.png" alt="Welcome to Spy Talk!" class="auto-animated-image">
      </a>
      <!--
      <a href="/debug-files" class="test-link">Check Files Debug</a>
      <div id="status" style="margin-top: 20px;"></div>
      -->
      
      <script>
        // Проверяем доступность basePage.html
        fetch('/basePage.html')
          .then(response => {
            const status = document.getElementById('status');
            if (response.ok) {
              status.innerHTML = '✅ basePage.html is accessible';
              status.style.color = 'green';
            } else {
              status.innerHTML = '❌ basePage.html NOT found (' + response.status + ')';
              status.style.color = 'red';
            }
          })
          .catch(error => {
            document.getElementById('status').innerHTML = '❌ Error: ' + error;
            document.getElementById('status').style.color = 'red';
          });
      </script>
      <script>
        // Безопасная передача IP
        const serverIP = ${JSON.stringify(safeIP)};
        
        // Функция для логирования
        function logIPInfo() {
          console.log('🎯 Сервер определил ваш IP как:', serverIP);
          console.log('📊 Дополнительная информация о подключении:');
          console.table({
            'User Agent': navigator.userAgent,
            'Язык': navigator.language,
            'Платформа': navigator.platform
          });
        }
        
        logIPInfo();
        
        // Сравнение с клиентским IP
        fetch('https://api.ipify.org?format=json')
          .then(r => r.json())
          .then(({ip: clientIP}) => {
            console.log('🌐 Клиентский IP:', clientIP);

            const link = document.getElementById('mainEnter');
            //link.innerText = clientIP;  
            link.href += "?ip="+clientIP;
            
            if (serverIP !== clientIP) {
              console.log('🔍 Разница в IP может быть вызвана:');
              console.log('   - Прокси сервером');
              console.log('   - VPN подключением');
              console.log('   - NAT трансляцией');
            }
          });
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, async () => {
  console.log(`Сервер запущен на порту ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных успешно установлено.");
  } catch (error) {
    console.error("Не удалось подключиться к базе данных:", error);
  }
});
