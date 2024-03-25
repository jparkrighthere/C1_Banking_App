import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './linktoken.jsx'
import './index.css'
import SignIn from './SignIn.jsx'
import Register from './Register.jsx'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
  </React.StrictMode>
);
