import { useNavigate } from 'react-router-dom';
import App from '../../linktoken';
import Header from '../Header/Header';

const AccountPage = () => {
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate('/account');
  };

  return (
    <div>
      <Header />
      <h2>Account Page</h2>
      <p>Welcome to your account! You can link your account below:</p>
      <App onSuccess={handleSignUpSuccess} />
    </div>
  );
};

export default AccountPage;
