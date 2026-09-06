const express = require("express");
const app = express();
const port = 3002;

// 1. Cписок постов
const posts = [
  { title: "Как выучить Express", content: "Просто начни писать код" },
  { title: "REST API для начинающих", content: "Главное — понять эндпоинты" },
  {
    title: "Что такое middleware",
    content: "Это функции между запросом и ответом",
  },
];

// 2. Список тегов
const tags = ["Node.js", "Express", "REST API", "JavaScript"];

// 1. Текстовый эндпоинт
app.get("/", (req, res) => {
  res.send("Добро пожаловать на учебный сервер!");
});

// 2. JSON эндпоинт 1
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// 3. JSON эндпоинт 2
app.get("/api/tags", (req, res) => {
  res.json(tags);
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
