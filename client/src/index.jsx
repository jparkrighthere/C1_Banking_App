import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SignIn from './SignIn.jsx';
import Register from './Register.jsx';
import AuthContext,{ AuthProvider } from './AuthContext';
import AccountPage from './components/Account/Account.jsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
                  <AccountPage />
                </RequireAuth>
              }
            />
            {/* Redirect to "/signin" if the path is not found */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
};

// To protect routes
const RequireAuth = ({ children }) => {
  const { isLoggedIn, authToken } = useContext(AuthContext);
  return isLoggedIn && authToken !== null ? children : <Navigate to="/signin" replace />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
