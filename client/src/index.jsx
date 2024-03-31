import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './linktoken.jsx';
import './index.css';
import SignIn from './SignIn.jsx';
import Register from './Register.jsx';
import AuthContext,{ AuthProvider } from './AuthContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, // For protecting routes
} from "react-router-dom";
import PropTypes from 'prop-types';

const Index = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <App />  
                </RequireAuth>
              } 
            /> 
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  )
};

// Simple component to protect routes
const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

ReactDOM.createRoot(document.getElementById('root')).render(<Index />);
