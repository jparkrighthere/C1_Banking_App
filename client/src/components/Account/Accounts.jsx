import App from '../../linktoken';
import Header from '../Header/Header';
import NetWorth from './Asset';
import { mockAccounts, mockNumOfItems, mockUserId } from './assetData';

const AccountPage = () => {

  return (
    <div>
      <Header />
      <NetWorth
        accounts={mockAccounts}
        numOfItems={mockNumOfItems}
        userId={mockUserId}
      />
      <App />
    </div>
  );
};

export default AccountPage;
