from flask import Flask, jsonify, request
import time

app = Flask(__name__)

posts = [
    {"title": "Как выучить Express", "content": "Просто начни писать код"},
    {"title": "REST API для начинающих", "content": "Главное — понять эндпоинты"},
    {"title": "Что такое middleware", "content": "Это функции между запросом и ответом"}
]

tags = ["Node.js", "Express", "REST API", "JavaScript"]

# Консольное логирование каждого запроса
@app.before_request
def log_request():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {request.method} {request.path}")

# 1. Текстовый эндпоинт
@app.route('/')
def home():
    return 'Hello, world!'

# 2. JSON эндпоинт 1
@app.route('/api/posts')
def status():
    return  jsonify(posts)

# 3. JSON эндпоинт 2
@app.route('/api/tags')
def info():
    return jsonify(tags)

# Обработка 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Маршрут не найден"}), 404

if __name__ == '__main__':
    app.run(port=5002, debug=True)