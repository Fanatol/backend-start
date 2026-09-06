const express = require("express");
const app = express();
const port = 3003;

// Массив пользователей
const users = [
  { id: 1, name: "Андрей", email: "email1@example.com" },
  { id: 2, name: "Мария", email: "email2@example.com" },
  { id: 3, name: "Николай", email: "email3@example.com" },
];

// Массив компаний
const companies = [
  { name: 'ООО "Рога и Копыта"', city: "Москва" },
  { name: 'ООО "ТехноПром"', city: "Санкт-Петербург" },
  { name: 'ООО "Инновации"', city: "Казань" },
];

// Консольное логирование каждого запроса
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url}`);
  next();
});

// 1. Текстовый эндпоинт
app.get("/", (req, res) => {
  res.send("Добро пожаловать на учебный сервер!");
});

// 2. JSON эндпоинт 1
app.get("/api/users", (req, res) => {
  res.json(users);
});

// 3. JSON эндпоинт 2
app.get("/api/companies", (req, res) => {
  res.json(companies);
});

// 4. JSON эндпоинт с параметром
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((el) => el.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  res.json({
    message: "Информация о пользователе",
    userId: id,
    name: user.name,
    email: user.email,
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
