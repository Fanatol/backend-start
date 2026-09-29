const express = require("express");
const app = express();
const port = 3000;

// ==================== ДАННЫЕ ====================
const users = [
  {
    id: 1,
    name: "Андрей",
    email: "andrey@mail.ru",
    age: 42,
    city: "Москва",
    companyId: 1,
  },
  {
    id: 2,
    name: "Мария",
    email: "maria@mail.ru",
    age: 34,
    city: "Москва",
    companyId: 1,
  },
  {
    id: 3,
    name: "Николай",
    email: "nikolay@mail.ru",
    age: 25,
    city: "Казань",
    companyId: 2,
  },
  {
    id: 4,
    name: "Степан",
    email: "stepan@mail.ru",
    age: 67,
    city: "Казань",
    companyId: 2,
  },
  {
    id: 5,
    name: "Алиса",
    email: "alisa@mail.ru",
    age: 52,
    city: "Владимир",
    companyId: 3,
  },
  {
    id: 6,
    name: "Ольга",
    email: "olga@mail.ru",
    age: 28,
    city: "Владимир",
    companyId: 3,
  },
  {
    id: 7,
    name: "Пётр",
    email: "petr@mail.ru",
    age: 45,
    city: "Москва",
    companyId: 1,
  },
  {
    id: 8,
    name: "Елена",
    email: "elena@mail.ru",
    age: 31,
    city: "Казань",
    companyId: 2,
  },
];

const companies = [
  { id: 1, name: "ТехноСофт", city: "Москва" },
  { id: 2, name: "ВебСтудия", city: "Казань" },
  { id: 3, name: "ДатаЛаб", city: "Владимир" },
];

const cities = [
  { id: 1, name: "Москва" },
  { id: 2, name: "Казань" },
  { id: 3, name: "Владимир" },
];

const posts = [
  { id: 1, userId: 1, title: "Как я начал изучать Express" },
  { id: 2, userId: 1, title: "Тонкости middleware" },
  { id: 3, userId: 2, title: "Мой первый REST API" },
  { id: 4, userId: 3, title: "Почему Node.js быстрый" },
  { id: 5, userId: 3, title: "Асинхронность в JS" },
  { id: 6, userId: 5, title: "Заметки о базах данных" },
  { id: 7, userId: 7, title: "Что такое CRUD" },
  { id: 8, userId: 8, title: "Советы по отладке" },
];

const comments = [
  { id: 1, postId: 1, userId: 2, text: "Отличная статья!" },
  { id: 2, postId: 1, userId: 3, text: "Спасибо, помогло" },
  { id: 3, postId: 2, userId: 5, text: "Актуально" },
  { id: 4, postId: 3, userId: 1, text: "Интересный опыт" },
  { id: 5, postId: 4, userId: 7, text: "Полезно" },
  { id: 6, postId: 5, userId: 8, text: "Согласен" },
  { id: 7, postId: 7, userId: 4, text: "Хорошо объяснено" },
  { id: 8, postId: 8, userId: 2, text: "Пригодилось" },
];

// ================= ФУНКЦИИ =========
function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// ==================== ЛОГИРОВАНИЕ И JSON ====================
app.use((req, res, next) => {
  const logString = `[${new Date().toISOString()}]: ${req.method} ${req.url} ${req.ip}`;
  console.log(logString);
  next();
});

app.use(express.json());

// ==================== БАЗОВЫЙ УРОВЕНЬ ====================
app.get("/users", (req, res) => {
  res.json({ count: users.length, users: users });
});

app.get("/users/:id", (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null)
    return res.status(400).json({ error: "id должен быть натуральным числом" });
  
  const user = users.find((el) => el.id === userId);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });

  return res.status(200).json(user);
});

app.get("/users/:id/posts", (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null)
    return res.status(400).json({ error: "id должен быть натуральным числом" });
  const user = users.find((el) => el.id === userId);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  const userPosts = posts.filter((el) => el.userId === userId);

  return res.status(200).json({ count: userPosts.length, posts: userPosts });
});

app.get("/cities/:city/users", (req, res) => {
  const cityName = req.params.city;
  const city = cities.find(
    (el) => el.name.toLowerCase() === cityName.toLowerCase(),
  );
  if (!city) return res.status(404).json({ error: "Город не найден" });
  const cityResidents = users.filter(
    (el) => el.city.toLowerCase() === cityName.toLowerCase(),
  );

  return res.status(200).json({
    city: city.name,
    count: cityResidents.length,
    users: cityResidents,
  });
});

// ================ ОБРАБОТЧИК 404 ================
app.use((req, res) => {
  return res.status(404).json({ error: "Страница не найдена" });
});

// ==================== ЗАПУСК ====================
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
