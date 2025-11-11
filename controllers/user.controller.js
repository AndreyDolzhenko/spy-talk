const { User } = require("../models");

// CREATE: Создание нового автора
exports.createUser = async (req, res) => {
  // console.log(req.body);
  try {

    const clientIP = req.clientIP; // ← IP доступен здесь!
    
    console.log(`Регистрация пользователя с IP: ${clientIP}`);
    
    // req.body содержит данные { name: 'Имя', birth_year: 1900 }
    const user = await User.create(req.body);
    res.status(201).json(user); // 201 Created
  } catch (error) {
    // Проверяем, является ли ошибка нарушением уникальности
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким именем уже существует",
      });
    }

    res
      .status(500)
      .json({ message: "Ошибка при создании пользователя", error: error.message });
  }
};

// READ: Получение всех авторов
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении авторов", error: error.message });
  }
};

// READ: Получение одного user по name
exports.getUserByName = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        name: req.params.name,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User не найден" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении автора", error: error.message });
  }
};

// READ: Получение одного автора по ID
exports.getUserById = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Автор не найден" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении автора", error: error.message });
  }
};

// UPDATE: Обновление автора по ID
exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
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
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
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
