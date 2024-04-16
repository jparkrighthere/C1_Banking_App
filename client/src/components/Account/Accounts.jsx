import App from '../../linktoken';
import Header from '../Header/Header';

const AccountPage = () => {

  return (
    <div style={{
      marginLeft: '5px',
    }}>
      <Header />
      <h1>Net Worth</h1>
      <p>What you have and what you owe - all in one place</p>
      <App />
    </div>
  );
};

export default AccountPage;
