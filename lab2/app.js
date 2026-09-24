const express = require("express");
const app = express();
const port = 3000;

// Массив пользователей
const users = [
  {
    id: 1,
    name: "Андрей",
    email: "email1@example.com",
    age: 42,
    city: "Москва",
  },
  {
    id: 2,
    name: "Мария",
    email: "email2@example.com",
    age: 34,
    city: "Казань",
  },
  {
    id: 3,
    name: "Николай",
    email: "email3@example.com",
    age: 25,
    city: "Владимир",
  },
  {
    id: 4,
    name: "Степан",
    email: "email4@example.com",
    age: 67,
    city: "Ставрополь",
  },
  {
    id: 5,
    name: "Алиса",
    email: "email5@example.com",
    age: 52,
    city: "Новогород",
  },
];
let nextId = 6;

// Консольное логирование каждого запроса
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url}`);
  next();
});

// Парсинг запросов с json
app.use(express.json());

// Запрос всех пользователей
app.get("/users", (req, res) => {
  res.json({
    count: users.length,
    users: users,
  });
});

// Запрос пользователя по id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((el) => el.id === id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  return res.json(user);
});

// Добавление пользователя
app.post("/users", (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ error: "Не введено имя пользователя" });
  if (!req.body.email)
    return res.status(400).json({ error: "Не введен email пользователя" });

  const newUser = {
    id: nextId,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age ?? null,
    city: req.body.city ?? "Не указан",
  };

  nextId++;
  users.push(newUser);
  return res.status(201).json(newUser);
});

// Полное обновление пользователя
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((el) => el.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Пользователь не найден" });
  if (!req.body.name)
    return res.status(400).json({ error: "Не введено имя пользователя" });
  if (!req.body.email)
    return res.status(400).json({ error: "Не введен email пользователя" });

  users[index] = {
    id: id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age ?? null,
    city: req.body.city ?? "Не указан",
  };
  return res.status(200).json(users[index]);
});

// Полное удаление пользователя
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((el) => el.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Пользователь не найден" });

  const deleted = users.splice(index, 1)[0];
  return res
    .status(200)
    .json({ message: "Пользователь успешно удален", deleted: deleted });
});



// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
