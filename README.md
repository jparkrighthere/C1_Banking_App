# CS639-TheCapitalists

## 1. Set-up steps

Open up two terminal windows, one for client and one for server.

### For Client
1. CD into the `client` directory:
    ```
    cd client
    ```
2. Run the following command to install dependencies:
    ```
    npm install
    ``` 
3. Start the development server:
    ```
    npm run dev
    ``` 

### For Server
1. CD into the `server` directory:
    ```
    cd server
    ```
2. Set up a Python virtual environment:
    ```
    python3 -m venv .venv
    ``` 
3. Activate the virtual environment:
   - On Mac:
     ```
     . .venv/bin/activate
     ``` 
   - On Windows:
     ```
     .venv\Scripts\activate
     ``` 
4. Install dependencies for the server:
    ```
    pip install -r requirements.txt
    ``` 
5. Start the server:
    ```
    python3 app.py
    ``` 


## 2. Overview of how the code works
Our full stack application is made up of 4 parts, the backend server, frontend client server, the plaid financial API, and a mongodb database. 

### MongoDB database
Our mongodb database holds two collections, a user collection and item collection. Each document in the user collection is a JSON object composed of:

    1. The user's unique ID
    2. Their username
    3. Their hashed password
    4. Their password salt
    5. An array of their connected items

A document in the item collection holds a JSON object that is composed of the items id and the items access token. An item is the plaid term for a financial institution (Chase, Wells Fargo, Capital One) and the access token allows the backend to get the information associated with that item.

### Backend Server
Our backend server is made using the Flask framework. In it, we connect to our mongoDB database to fetch all our user information. Our backend server handles all user authentication and adds all the user information into our mongo database. Our backend also has multiple routes that our client can call to get the requested financial information, such as user account data and transaction data. Whenever the frontend calls a route requesting data, our backend verifies the user identity using the JSON web token provided on call, finds the user in the database, retrieves their stored access tokens per financial institution, makes the call to plaid servers for the data using the access tokens, returns the data as JSON to the client.

### Frontend Client
Our frontend is made with ReactJS, React Router, and ReChart for data visualization. Our client has 3 pages, signin, register, accounts, budgeting. The routes are protected, meaning you will not be able to access accounts and budgeting unless you are signed in. The accounts and budgeting page are composed of multiple widgets, each displaying its own information about the users financial data. Each widget makes the call to our backend server using HTTP and providing the user JSON web token.

### What works & what doesn’t
Our application fully works in that everything displays what it is supposed to and is secure. There are a few bugs in it that are a bit annoying, such as when the user refreshes the page the client forgets that they are signed in. Our app is also not responsive so if they user is on mobile they would not see a smooth UI. 

### What would you work on next
What we would work on next is supporting more financial information and expanding the user capabilities. The plaid API is able to retrieve much more information that we didn't have time to implement such as mortgage information, income/payroll, and investments/assets. If we had more time for this project we would implement more routes and integration to support these categories. We would also allow the user to set budgeting limits. Our app only displays their spending habits, but in the future we could allow them to interact more with the app by setting budgeting features.
