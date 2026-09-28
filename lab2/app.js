// ============================================================
// 1. ПОДКЛЮЧЕНИЕ МОДУЛЕЙ И ИНИЦИАЛИЗАЦИЯ
// ============================================================
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;


// ============================================================
// 2. ХРАНИЛИЩЕ ДАННЫХ В ПАМЯТИ
// ============================================================
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


// ============================================================
// 3. ФУНКЦИИ ВАЛИДАЦИИ
// ============================================================
// 3.1. Валидация для POST / PUT (все обязательные поля)
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

// 3.2. Валидация для PATCH (все поля необязательные)
function validatePatch(body) {
  const errors = [];
  const { name, email, age, city } = body;

  // Проверка name
  if (name != null) {
    if (typeof name !== "string") {
      errors.push("name должен быть строкой");
    } else if (name.trim() === "") {
      errors.push("name не может быть пустым");
    }
  }

  // Проверка email
  if (email != null) {
    if (typeof email !== "string") {
      errors.push("email должен быть строкой");
    } else if (email.trim() === "") {
      errors.push("email не может быть пустым");
    } else if (!email.includes("@")) {
      errors.push("email должен содержать @");
    }
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


// ============================================================
// 4. ГЛОБАЛЬНЫЕ MIDDLEWARE
// ============================================================
// 4.1. Логирование запросов (консоль + файл access.log)
app.use((req, res, next) => {
  const logString = `[${new Date().toISOString()}]: ${req.method} ${req.url}`;
  console.log(logString);
  fs.appendFile("access.log", logString + "\n", (err) => {
    if (err) console.error("Ошибка записи в лог:", err);
  });
  next();
});

// 4.2. Парсинг JSON-тела запроса
app.use(express.json());


// ============================================================
// 5. МАРШРУТЫ: READ
// ============================================================
// 5.1. GET /users — список пользователей (поиск, сортировка, пагинация)
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
  const skip = (page - 1) * limit;
  usersRes = usersRes.slice(skip, skip + limit);

  return res.json({
    count: total,
    users: usersRes,
  });
});

// 5.2. GET /users/stats — статистика (средний возраст)
app.get("/users/stats", (req, res) => {
  const count = users.length;
  let countAge = 0;
  const sumAge = users.reduce((arr, el) => {
    if (el.age != null) {
      countAge++;
      return arr + el.age;
    }
    return arr;
  }, 0);
  if (countAge === 0)
    return res
      .status(200)
      .json({ message: "Нет данных о возрасте", averageAge: null });
  return res
    .status(200)
    .json({ count: count, countAge: countAge, averageAge: sumAge / countAge });
});

// 5.3. GET /users/:id — один пользователь по id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((el) => el.id === id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  return res.json(user);
});

// 5.4. GET /users/:id/related — похожие по городу
app.get("/users/:id/related", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((el) => el.id === id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const userRel = users.filter(
    (el) => el.city === user.city && el.id !== user.id,
  );
  return res.status(200).json({ count: userRel.length, users: userRel });
});


// ============================================================
// 6. МАРШРУТЫ: CREATE
// ============================================================
// 6.1. POST /users — создать пользователя
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

// 6.2. POST /users/bulk — массовое создание
app.post("/users/bulk", (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0)
    return res
      .status(400)
      .json({ error: "Должен быть передан не пустой массив пользователей" });

  const errors = [];
  for (let i = 0; i < req.body.length; i++) {
    const userErrors = validateUser(req.body[i]);
    if (userErrors.length > 0) {
      errors.push({ index: i, errors: userErrors });
    }
  }
  if (errors.length > 0) return res.status(400).json({ errors });

  const created = [];
  for (const one of req.body) {
    const newUser = {
      id: nextId,
      name: one.name,
      email: one.email,
      age: one.age ?? null,
      city: one.city ?? "Не указан",
    };
    nextId++;
    users.push(newUser);
    created.push(newUser);
  }

  return res.status(201).json({ count: created.length, users: created });
});


// ============================================================
// 7. МАРШРУТЫ: UPDATE
// ============================================================
// 7.1. PUT /users/:id — полное обновление
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

// 7.2. PATCH /users/:id — частичное обновление
app.patch("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((el) => el.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Пользователь не найден" });
  const errors = validatePatch(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });
  const user = users[index];

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.age !== undefined) user.age = req.body.age;
  if (req.body.city !== undefined) user.city = req.body.city;

  return res.status(200).json(users[index]);
});


// ============================================================
// 8. МАРШРУТЫ: DELETE
// ============================================================
// 8.1. DELETE /users/:id — удалить одного
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((el) => el.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Пользователь не найден" });

  return res.status(204).end();
});

// 8.2. DELETE /users — удалить всех
app.delete("/users", (req, res) => {
  const deletedCount = users.length;
  users.length = 0;
  return res.status(200).json({
    message: `Успешно удалены все элементы`,
    deletedCount: deletedCount,
  });
});


// ============================================================
// 9. ОБРАБОТКА ОШИБОК
// ============================================================
// 9.1. 404 — маршрут не найден
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// 9.2. 500 — внутренняя ошибка сервера
app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err.message);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});


// ============================================================
// 10. ЗАПУСК СЕРВЕРА
// ============================================================
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});