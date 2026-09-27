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

// Функция валидации данных
function validateUser(body) {
  const errors = [];
  const { name, email, age, city } = body;

  // Проверка name
  if (typeof name !== "string") {
    errors.push("name обязателен и должен быть строкой");
  } else if (name.trim() === "") {
    errors.push("name не может быть пустым");
  }

  // Проверка email
  if (typeof email !== "string") {
    errors.push("email обязателен и должен быть строкой");
  } else if (email.trim() === "") {
    errors.push("email не может быть пустым");
  } else if (!email.includes("@")) {
    errors.push("email должен содержать @");
  }

  // Проверка age
  if (age != null) {
    if (!Number.isInteger(age)) {
      errors.push("age должен быть целым числом");
    } else if (age < 0 || age > 150) {
      errors.push("age должен быть в диапазоне 0–150");
    }
  }

  // Проверка city
  if (city != null) {
    if (typeof city !== "string") {
      errors.push("city должен быть строкой");
    } else if (city.trim() === "") {
      errors.push("city не может быть пустым");
    }
  }

  return errors;
}

// Консольное логирование каждого запроса
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url}`);
  next();
});

// Парсинг запросов с json
app.use(express.json());

// Запрос пользователей
app.get("/users", (req, res) => {
  let usersRes = [...users];

  // Поиск пользователей по имени (search)
  const search = req.query.search;
  if (search) {
    const searchUsers = users.filter((el) =>
      el.name.toLowerCase().includes(search.toLowerCase()),
    );
    usersRes = searchUsers;
  }

  // Сортировка пользователей (sort + order)
  const sortTags = ["name", "email", "age", "city"];
  const sort = req.query.sort;
  const order = req.query.order;

  // Сортировка по возрасту
  if (sort) {
    if (!sortTags.includes(sort)) {
      return res
        .status(400)
        .json({ error: "Нет такого тэга сортировки", tags: sortTags });
    }

    if (sort === "age") {
      if (order === "desc") usersRes.sort((a, b) => b.age - a.age);
      else usersRes.sort((a, b) => a.age - b.age);
    }
  }

  const total = usersRes.length;
  // Пагинация
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  if (page < 1 || limit < 1 || limit > 100)
    return res.status(400).json({ error: "Неверные page или limit" });
  let skip = (page - 1) * limit;
  usersRes = usersRes.slice(skip, skip + limit);

  // Вывод
  return res.json({
    count: total,
    users: usersRes,
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
  const errors = validateUser(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

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
  const errors = validateUser(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

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

  return res.status(204).end();
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
