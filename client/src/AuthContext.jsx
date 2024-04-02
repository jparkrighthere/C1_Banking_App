import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({
  isLoggedIn: false, // Initial state
  authToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setIsLoggedIn(true);
      setAuthToken(storedToken);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext; 
