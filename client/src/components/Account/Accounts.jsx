import App from '../../linktoken';
import Header from '../Header/Header';
import NetWorth from './Asset';
import { mockPersonalAssets, mockAccounts, mockNumOfItems, mockUserId, mockAssetsOnly } from './assetData';

const AccountPage = () => {

  return (
    <div>
      <Header />
      <NetWorth
      personalAssets={mockPersonalAssets}
      accounts={mockAccounts}
      numOfItems={mockNumOfItems}
      userId={mockUserId}
      assetsOnly={mockAssetsOnly}
      />
      <App />
    </div>
  );
};

export default AccountPage;
