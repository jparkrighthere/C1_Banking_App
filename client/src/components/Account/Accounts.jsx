import App from '../../linktoken';
import Header from '../Header/Header';
import NetWorth from './Asset';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../AuthContext';

const AccountPage = () => {
  const { authToken } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    const response = await fetch('/api/accounts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.length > 0) {
      const accountsData = data.flatMap(entry => 
        entry.accounts.map(account => ({
          accountName: account.name,
          subtype: account.subtype,
          current_balance: account.balances.current
        }))
      );
      setAccounts(accountsData);
    }
  };

  const fetchTransactions = async () => {
    const response = await fetch('/api/transactions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
  }
  

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  return (
    <div>
      <Header />
      <NetWorth
        accounts={accounts}
        numOfItems={accounts.length}
      />
      <App />
      {/* <div>
      {accounts.map((account, index) => (
          <div key={index}>   
            <pre>{JSON.stringify(account, null, 2)}</pre>
          </div>
        ))}
        </div> */}
    </div>
  );
};

export default AccountPage;