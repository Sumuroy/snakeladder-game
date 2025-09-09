from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ Flask backend is running. Use /roll to roll the dice."

@app.route('/roll', methods=['GET'])
def roll_dice():
    dice = random.randint(1, 6)
    return jsonify({'roll': dice})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
