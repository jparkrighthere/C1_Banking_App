import json
import time
import plaid
import os
import bcrypt # for password hashing
import certifi
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.products import Products
from plaid.api import plaid_api


load_dotenv()
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SANDBOX_API_KEY')
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES', 'US').split(',')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_REDIRECT_URI = os.getenv('PLAID_REDIRECT_URI')
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
mongo_uri = os.getenv('MONGO_DB_URI')

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
CORS(app)
jwt = JWTManager(app)

load_dotenv()

host = plaid.Environment.Sandbox
configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
)

api_client = plaid.ApiClient(configuration)

plaid_client = plaid_api.PlaidApi(api_client)

products = []
for product in PLAID_PRODUCTS:
    products.append(Products(product))

access_token = None
transfer_id = None
item_id = None

mongo_client = MongoClient(mongo_uri, tlsCAFile=certifi.where())

try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = mongo_client["Test"] 
collection = db.get_collection("Test") # Get the collection which will store our users (currently named Test)
#user_id = None

#def add_connected_account(user_id, access_token):
#    user = collection.find_one({"_id": user_id})
#    connected_accounts = user["connected_accounts"]
#    len = len(connected_accounts)
#    str = "account" + str(len)
#    collection.update_one({"_id": user_id}, {"$set": {f"properties.connected-accounts.{account_id}": {"access-token": access_token, "budget": {}}}})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # 1. If Username in Mongo -> 
    #       Hash the password 
    #       if the hash equals stored hash:
    #           Set The user id
    #       Else 
    #           return jsonify({"error": "Invalid password", "message": "The provided password is incorrect"}), 401
    #    If username not in mongo -> 
    #       return jsonify({"error": "User not found", "message": "The provided username does not exist"}), 404

    if username == None or password == None:
        return jsonify({"error": "Invalid password or username", "message": "The provided information is incorrect"}), 401
    user_id = None
    
    if(collection.find_one({"name": username})):
        user = collection.find_one({"name": username})
        salt = user["salt"]
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        print(hashed_password)
        print(user["password"])
        if(hashed_password == user["password"]):
            user_id = user["_id"]
        else:
            return jsonify({"error": "Invalid password", "message": "The provided password is incorrect"}), 401
    else:
        return jsonify({"error": "User not found", "message": "The provided username does not exist"}), 404
    
    if user_id!=None:
        token = create_access_token(identity=user_id)
        return jsonify(message="User login successful", access_token=token), 200
    return jsonify({"error": "Error with login"}), 400


@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if username == None or password == None:
        return jsonify({"error": "Invalid password or username", "message": "The provided information is incorrect"}), 401
    user_id = None
    
    # 1. If Username in Mongo:
    #       return jsonify({ "error": "User already exists","message": "The provided username is already registered"}), 409
    #    Else        
    #       Hash the password with a salt
    #       Create the mongo user object to be stored along with the unique user_id, mongo might already generate a unique id
    #       Store the user object into our database
    #       Set the User_id

    if(collection.find_one({"name": username})):
        return jsonify({ "error": "User already exists","message": "The provided username is already registered"}), 409

    else:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        new_user = {
            "_id": collection.count_documents({})+1,
            "name": username,
            "password": hashed_password,
            "salt": salt,
            "connected_accounts": {}
        }
        collection.insert_one(new_user)
        user_id = new_user["_id"]

    
    if user_id!=None:
        token = create_access_token(identity=user_id)
        return jsonify(message="User registration successful", access_token=token), 200
    return jsonify({"error": "Error with Registration"}), 400
    
@app.route('/api/info', methods=['POST'])
@jwt_required()
def info():
    global access_token
    global item_id
    return jsonify({
        'item_id': item_id,
        'access_token': access_token,
        'products': PLAID_PRODUCTS
    })

@app.route('/api/create_link_token', methods=['POST'])
@jwt_required()
def create_link_token():
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="Capital One App",
            country_codes=list(
                map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(time.time())
            )
        )
        if PLAID_REDIRECT_URI != None:
            request['redirect_uri'] = PLAID_REDIRECT_URI
        response = plaid_client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        return json.loads(e.body)


@app.route('/api/set_access_token', methods=['POST'])
@jwt_required()
def get_access_token():
    global access_token
    global item_id
    global transfer_id
    data = request.get_json()
    public_token = data.get('public_token')

    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        # TODO Store this access_token for the corresponding user in the database
        access_token = exchange_response['access_token']
        # add_connected_account(user_id, access_token)
        item_id = exchange_response['item_id']
        return jsonify(exchange_response.to_dict())
    except plaid.ApiException as e:
        return json.loads(e.body)

if __name__ == "__main__":
    app.run(debug=True, port=5000)