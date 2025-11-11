const { Conversation } = require("../models");
const UAParser = require("ua-parser-js");

// CREATE: Создание нового автора
exports.createConversation = async (req, res) => {
  console.log("body - ", req.body);

  try {
    // req.body содержит данные { name: 'Имя', birth_year: 1900 }
    const conversation = await Conversation.create(req.body);
    res.status(201).json(conversation); // 201 Created
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при создании автора", error: error.message });
  }
};

// READ: Получение всех авторов
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll();
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении авторов", error: error.message });
  }
};

// READ: Получение одного автора по ID
exports.getConversationByUserId = async (req, res) => {
  console.log(req.body);
  try {
    const conversations = await Conversation.findAll({
      where: {
        user_id: req.params.user_id,
      },
      order: [["createdAt", "DESC"]], // сортировка по дате создания (новые first)
    });
    if (!conversations) {
      return res.status(404).json({ message: "Автор не найден" });
    }
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении автора", error: error.message });
  }
};

// UPDATE: Обновление автора по ID
exports.updateConversation = async (req, res) => {
  try {
    const [updated] = await Conversation.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedConversation = await Conversation.findByPk(req.params.id);
      res.status(200).json(updatedConversation);
    } else {
      res.status(404).json({ message: "Автор не найден" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении автора", error: error.message });
  }
};

// DELETE: Удаление автора по ID
exports.deleteConversation = async (req, res) => {
  try {
    const deletedCount = await Conversation.destroy({
      where: { user_id: req.params.user_id },
    });

    res.status(200).json({
      message: `Удалено диалогов: ${deletedCount}`,
      deletedCount: deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при удалении диалогов",
      error: error.message,
    });
  }
};

exports.createConversation = async (req, res) => {
  try {
    // Логирование User Agent
    const userAgent = req.headers["user-agent"];
    console.log("User Agent:", userAgent);
    req.userAgent = userAgent;
    // Здесь забираем информацию об устройстве клиента
    const parser = new UAParser();

    const result = parser.setUA(userAgent).getResult();

    req.deviceInfo = {
      browser: result.browser.name + " " + result.browser.version,
      os: result.os.name + " " + result.os.version,
      device: result.device.type || "desktop",
      deviceModel: result.device.model,
      userAgent: userAgent,
    };

    console.log("📱 Device Info:", req.deviceInfo);

    const { user_id, content, client, ipAddress } = req.body;

    // ipAddress += userAgent;

    // Валидация обязательных полей
    if (!user_id || !content) {
      return res.status(400).json({
        success: false,
        message: "user_id and content are required",
      });
    }

    const conversation = await Conversation.create({
      user_id,
      content,
      client: client || 0,
      ipAddress: ipAddress || req.ip, // Используем req.ip если ipAddress не передан
      userAgent, // Сохраняем userAgent в базу
    });

    res.status(201).json({
      success: true,
      data: conversation,
      message: "Conversation created successfully",
    });

    // console.log("!!! conversation !!! ", conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);

    // Более детальная обработка ошибок
    let statusCode = 500;
    let errorMessage = "Error creating conversation";

    if (error.name === "SequelizeValidationError") {
      statusCode = 400;
      errorMessage =
        "Validation error: " + error.errors.map((e) => e.message).join(", ");
    } else if (error.name === "SequelizeUniqueConstraintError") {
      statusCode = 400;
      errorMessage = "Duplicate entry";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
