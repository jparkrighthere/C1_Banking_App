import json
import time
import plaid
import os
import bcrypt # for password hashing
import certifi
from datetime import timedelta
from bson import ObjectId
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
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.accounts_get_request import AccountsGetRequest
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


mongo_client = MongoClient(mongo_uri, tlsCAFile=certifi.where())

try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = mongo_client["Test"] 
users = db.get_collection("Users") # Get the collection which will store our users
connected_accounts = db.get_collection("Connected Accounts") # Get the collection which will store our connected accounts

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if username == None or password == None:
        return jsonify({"error": "Invalid password or username", "message": "The provided information is incorrect"}), 401
    user_id = None
    
    if(users.find_one({"name": username})): # If the user exists
        user = users.find_one({"name": username}) # Get the user object
        salt = user["salt"] # Get the salt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt) # Hash the password using the associated salt
        if(hashed_password == user["password"]): 
            user_id = str(user["_id"]) # Set the user id to the user id associated with the account
        else: # If the password is incorrect
            return jsonify({"error": "Invalid password", "message": "The provided password is incorrect"}), 401
    else: # If the user does not exist
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

    if(users.find_one({"name": username})): # If the user exists
        return jsonify({ "error": "User already exists","message": "The provided username is already registered"}), 409

    else:
        salt = bcrypt.gensalt() # Generate a salt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt) # Hash the password using the salt
        new_user = { # Create the user object
            "name": username,
            "password": hashed_password,
            "salt": salt,
            "connected_accounts": []
        }
        users.insert_one(new_user)
        user_id = str(users.find_one({"name": username})["_id"]) # Get the id of the user

    if user_id!=None:
        token = create_access_token(identity=user_id)
        return jsonify(message="User registration successful", access_token=token), 200
    return jsonify({"error": "Error with Registration"}), 400
    

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
    #Extract user_id from request, add item_id to user document
    data = request.get_json()
    public_token = data.get('public_token')
    user_id= get_jwt_identity()
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        
        # TODO Store the item_id for the corresponding user in the database
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        if user_id != None: # Makes sure we have a working user id
            new_acc = { # Create the connected account object
                "_id": item_id,
                "access-token": access_token,
            }
            acc_id = new_acc["_id"] # Get the id of the connected account
            connected_accounts.insert_one(new_acc) # Store the connected account in the database
            users.find_one_and_update({"_id": ObjectId(user_id)}, {"$push": {"connected_accounts": acc_id}}) # Add the connected account to the user
    
        return jsonify(msg="Successfully added item to user connected accounts")
    except plaid.ApiException as e:
        return json.loads(e.body)
    

@app.route('/api/accounts', methods=['GET'])
@jwt_required()
def get_accounts(): 
    user_id = get_jwt_identity()
    try:
        user = users.find_one({'_id': ObjectId(user_id)})
        if user:
            accounts = user.get('connected_accounts', [])
            account_data = []
            for item in accounts:        
                access_token_item = connected_accounts.find_one({'_id':item}).get("access-token")
                
                request = AccountsGetRequest(
                    access_token=access_token_item
                )
                response = plaid_client.accounts_get(request)
                account_data.append(response.to_dict())
        return jsonify(account_data)
    except plaid.ApiException as e:
        return jsonify(e)
    
@app.route('/api/identity', methods=['GET'])
@jwt_required()
def get_identity():
    user_id = get_jwt_identity()
    user = users.find_one({'_id': ObjectId(user_id)})
    user_name = user["name"]
    
    return jsonify({'identity': user_name})

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions_data = []
    try:
        user = users.find_one({'_id': ObjectId(user_id)})
        if user:
            accounts = user.get('connected_accounts', [])
            for item in accounts:
                access_token_item = connected_accounts.find_one(
                    {'_id': item}).get("access-token")
                # Set cursor to empty to receive all historical updates
                cursor = ''
                # New transaction updates since "cursor"
                added = []
                modified = []
                removed = []  # Removed transaction ids
                has_more = True
                # Iterate through each page of new transaction updates for item
                while has_more:
                    request = TransactionsSyncRequest(
                        access_token=access_token_item,
                        cursor=cursor,
                    )
                    response = plaid_client.transactions_sync(request).to_dict()
                    added.extend(response['added'])
                    modified.extend(response['modified'])
                    removed.extend(response['removed'])
                    has_more = response['has_more']
                    # Update cursor to the next cursor
                    cursor = response['next_cursor']
                # Sort and select the 10 most recent transactions
                transactions_data.extend(sorted(added, key=lambda t: t['date'])[-10:])
        return jsonify(transactions_data)
    except plaid.ApiException as e:
        return jsonify(e)

if __name__ == "__main__":
    app.run(debug=True, port=5000)