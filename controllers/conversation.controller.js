const { Conversation } = require("../models");

// CREATE: Создание нового автора
exports.createConversation = async (req, res) => {
  console.log(req.body);

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
    const deleted = await Conversation.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: "Автор не найден" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении автора", error: error.message });
  }
};
