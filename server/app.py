from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv('MONGO_DB_URI')
client = MongoClient(mongo_uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route('/api/hello')
def some_endpoint():
    data = {'message': 'This is a response from the Flask backend'}
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
