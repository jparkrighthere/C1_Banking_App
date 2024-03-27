import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);

  const setToken = (token) => {
    localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
