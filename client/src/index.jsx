import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './linktoken.jsx';
import './index.css';
import SignIn from './SignIn.jsx';
import Register from './Register.jsx';
import { AuthProvider } from './AuthContext';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);