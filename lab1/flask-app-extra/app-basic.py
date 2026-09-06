from flask import Flask, jsonify, request
import time

app = Flask(__name__)

# 1. Текстовый эндпоинт
@app.route('/')
def home():
    return 'Hello, world!'

# 2. JSON эндпоинт 1
@app.route('/api/date')
def status():
    return jsonify({"date": "2024-01-01", "day": "Monday"})

if __name__ == '__main__':
    app.run(port=5001, debug=True)