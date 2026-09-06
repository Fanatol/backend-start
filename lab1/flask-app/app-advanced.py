from flask import Flask, jsonify, request
import time

app = Flask(__name__)

users = [
    {"id": 1, "name": "Андрей", "email": "email1@example.com"},
    {"id": 2, "name": "Мария", "email": "email2@example.com"},
    {"id": 3, "name": "Николай", "email": "email3@example.com"}
]

companies = [
    {"name": 'ООО "Рога и Копыта"', "city": "Москва"},
    {"name": 'ООО "ТехноПром"', "city": "Санкт-Петербург"},
    {"name": 'ООО "Инновации"', "city": "Казань"}
]

# Консольное логирование каждого запроса
@app.before_request
def log_request():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {request.method} {request.path}")

# 1. Текстовый эндпоинт
@app.route('/')
def home():
    return 'Hello, world!'

# 2. JSON эндпоинт 1
@app.route('/api/users')
def status():
    return jsonify(users)

# 3. JSON эндпоинт 2
@app.route('/api/companies')
def info():
    return jsonify(companies)

# 4. JSON эндпоинт с параметром
@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    for user in users:
        if user["id"] == user_id:
            return jsonify({"message": "Информация о пользователе", "userId": user_id, "name": user["name"], "email": user["email"]})

    return jsonify({"error": "Пользователь не найден"})

# Обработка 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Маршрут не найден"}), 404

if __name__ == '__main__':
    app.run(port=5003, debug=True)