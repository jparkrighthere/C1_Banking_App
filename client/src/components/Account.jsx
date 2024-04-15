import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Register from '../Register';
import App from '../linktoken';

const AccountPage = () => {
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate('/account');
  };

  return (
    <div>
      <h2>Account Page</h2>
      <p>Welcome to your account! You can link your account below:</p>
      <App onSuccess={handleSignUpSuccess} />
      <p>Already linked your account? <Link to="/signin">Sign In</Link></p>
    </div>
  );
};

export default AccountPage;
