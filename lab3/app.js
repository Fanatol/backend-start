// ============ 1. ПОДКЛЮЧЕНИЕ МОДУЛЕЙ И ИНИЦИАЛИЗАЦИЯ ============
const express = require("express");
const app = express();
const port = 3000;

// ============ 2. ДАННЫЕ ============
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

// ============ 3. ФУНКЦИИ ============
// 3.1 parsePositiveInt
function parsePositiveInt(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// ============ 4. ГЛОБАЛЬНЫЕ MIDDLEWARE ============
// 4.1 Логирование запросов
app.use((req, res, next) => {
  const logString = `[${new Date().toISOString()}]: ${req.method} ${req.url} ${req.ip}`;
  console.log(logString);
  next();
});

// 4.2 Парсинг JSON
app.use(express.json());

// ============ 5. МАРШРУТЫ: /users ============

// 5.1 GET /users (search, filter, sort, pagination)
app.get("/users", (req, res) => {
  let usersResult = [...users];

  const search = req.query.search;
  if (search) {
    usersResult = usersResult.filter((el) =>
      el.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const filter = req.query.filter;
  if (filter) {
    const parts = filter.split(":");
    if (parts.length !== 2)
      return res
        .status(400)
        .json({ error: "Неправильные параметры фильтрации" });
    const [field, value] = parts;
    if (!field || !value || value.trim() === "")
      return res
        .status(400)
        .json({ error: "Одно из значений фильтрации пустое" });

    if (field === "city") {
      usersResult = usersResult.filter(
        (el) => el.city.toLowerCase() === value.toLowerCase(),
      );
    } else if (field === "age") {
      const filterAge = parsePositiveInt(value);
      if (filterAge !== null) {
        usersResult = usersResult.filter((el) => el.age === filterAge);
      } else {
        return res.status(400).json({
          error: "Фильтрация по age должна принимать натуральное число",
        });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Доступна фильтрация по city и age" });
    }
  }

  const sort = req.query.sort;
  const startOrder = req.query.order;
  const order = startOrder || "asc";
  if (sort) {
    const tagsSort = ["id", "name", "age"];
    const tagsOrder = ["asc", "desc"];
    if (!tagsSort.includes(sort))
      return res
        .status(400)
        .json({ error: "Нет сортировки по такому параметру" });
    if (!tagsOrder.includes(order))
      return res.status(400).json({ error: "Нет такого типа сортировки" });

    if (sort === "name") {
      if (order === "asc")
        usersResult.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      else usersResult.sort((a, b) => b.name.localeCompare(a.name, "ru"));
    } else if (sort === "age") {
      if (order === "asc") usersResult.sort((a, b) => a.age - b.age);
      else usersResult.sort((a, b) => b.age - a.age);
    } else if (sort === "id") {
      if (order === "asc") usersResult.sort((a, b) => a.id - b.id);
      else usersResult.sort((a, b) => b.id - a.id);
    }
  }

  const startPage = req.query.page;
  const startLimit = req.query.limit;

  const page = parsePositiveInt(startPage || 1);
  if (page === null)
    return res
      .status(400)
      .json({ error: "page должен быть натуральным числом" });

  const limit = parsePositiveInt(startLimit || 10);
  if (limit === null || limit > 100)
    return res
      .status(400)
      .json({ error: "limit должен быть натуральным числом от 1 до 100" });

  const total = usersResult.length;
  const skip = (page - 1) * limit;
  usersResult = usersResult.slice(skip, skip + limit);

  return res.json({
    count: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
    users: usersResult,
  });
});

// 5.2 GET /users/stats
app.get("/users/stats", (req, res) => {
  let count = 0;
  let totalAge = 0;
  let minAge = Infinity;
  let maxAge = -Infinity;
  for (let i = 0; i < users.length; i++) {
    const userAge = parsePositiveInt(users[i].age);
    if (userAge !== null) {
      count++;
      totalAge += userAge;
      if (minAge > userAge) minAge = userAge;
      if (maxAge < userAge) maxAge = userAge;
    }
  }

  if (count === 0)
    return res
      .status(200)
      .json({ count: 0, averageAge: null, minAge: null, maxAge: null });

  const averageAge = Math.round((totalAge / count) * 10) / 10;
  return res.status(200).json({
    count: count,
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
  });
});

// 5.3 GET /users/:id
app.get("/users/:id", (req, res) => {
  const userId = parsePositiveInt(req.params.id);
  if (userId === null)
    return res.status(400).json({ error: "id должен быть натуральным числом" });

  const user = users.find((el) => el.id === userId);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });

  return res.status(200).json(user);
});

// 5.4 GET /users/:id/posts
app.get("/users/:id/posts", (req, res) => {
  const userId = parsePositiveInt(req.params.id);
  if (userId === null)
    return res.status(400).json({ error: "id должен быть натуральным числом" });
  const user = users.find((el) => el.id === userId);
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  const userPosts = posts.filter((el) => el.userId === userId);

  return res.status(200).json({ count: userPosts.length, posts: userPosts });
});

// 5.5 GET /users/:userId/posts/:postId/comments/:commentId
app.get("/users/:userId/posts/:postId/comments/:commentId", (req, res) => {
  const userId = parsePositiveInt(req.params.userId);
  const postId = parsePositiveInt(req.params.postId);
  const commentId = parsePositiveInt(req.params.commentId);

  if (userId === null)
    return res
      .status(400)
      .json({ error: "id пользователя должен быть натуральным числом" });
  if (postId === null)
    return res
      .status(400)
      .json({ error: "id поста должен быть натуральным числом" });
  if (commentId === null)
    return res
      .status(400)
      .json({ error: "id комментария должен быть натуральным числом" });

  const user = users.find((el) => el.id === userId);
  const post = posts.find((el) => el.id === postId);
  const comment = comments.find((el) => el.id === commentId);

  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  if (!post) return res.status(404).json({ error: "Пост не найден" });
  if (!comment) return res.status(404).json({ error: "Комментарий не найден" });

  if (post.userId !== userId)
    return res
      .status(404)
      .json({ error: "Данному пользователю не принадлежит этот пост" });

  if (comment.postId !== postId)
    return res
      .status(404)
      .json({ error: "Под данным постом нет такого комментария" });

  return res
    .status(200)
    .json({ user: user.name, post: post.title, comment: comment.text });
});

// ============ 6. МАРШРУТЫ: /cities ============

// 6.1 GET /cities/:city/users
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

// 6.2 GET /cities/:city/users/:userId
app.get("/cities/:city/users/:userId", (req, res) => {
  const cityName = req.params.city;
  const userId = parsePositiveInt(req.params.userId);
  if (userId === null)
    return res.status(400).json({ error: "ID должен быть натуральным числом" });

  const city = cities.find(
    (el) => el.name.toLowerCase() === cityName.toLowerCase(),
  );
  if (!city) return res.status(404).json({ error: "Город не найден" });
  const cityResidents = users.filter(
    (el) => el.city.toLowerCase() === cityName.toLowerCase(),
  );
  const cityUsersById = cityResidents.find((el) => el.id === userId);
  if (!cityUsersById)
    return res.status(404).json({ error: "Пользователь не найден" });

  return res.status(200).json({
    city: city.name,
    user: cityUsersById,
  });
});

// ============ 7. МАРШРУТЫ: /companies ============

// 7.1 GET /companies/:id/users
app.get("/companies/:id/users", (req, res) => {
  const companyId = parsePositiveInt(req.params.id);
  if (companyId === null)
    return res
      .status(400)
      .json({ error: "ID должен быть положительным числом" });

  const company = companies.find((el) => el.id === companyId);
  if (!company) return res.status(404).json({ error: "Компания не найдена" });
  const companyUsers = users.filter((el) => el.companyId === companyId);
  res.status(200).json({
    company: company.name,
    count: companyUsers.length,
    users: companyUsers,
  });
});

// ============ 8. ОБРАБОТКА ОШИБОК ============

// 8.1 404
app.use((req, res) => {
  return res.status(404).json({ error: "Страница не найдена" });
});

// 8.2 500
app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err.message);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// ============ 9. ЗАПУСК СЕРВЕРА ============
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});