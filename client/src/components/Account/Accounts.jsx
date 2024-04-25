import LinkToken from '../../linktoken';
import Header from '../Header/Header';
import NetWorth from './Asset';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../AuthContext';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import './Accounts.css';

function currencyFilter(value) {

  const isNegative = value < 0;
  const displayValue = value < 0 ? -value : value;
  return `${isNegative ? '-' : ''}$${displayValue
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')}`;
}

const AccountPage = () => {
  const { authToken } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      fetchAccounts();
      fetchTransactions();
    }, []);


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
    const cashout = data.reduce((acc, transaction) => {
      if (transaction.amount > 0) {
          acc += transaction.amount;
      }
      return acc;
    }, 0);
    localStorage.setItem('cash-out', cashout);
    setTransactions(data);
  }
  
  return (
    <>
      <Header />
      <div className="page-container">
        <div>
          <NetWorth accounts={accounts} numOfItems={accounts.length} fetchTransactions={fetchTransactions} transactions={transactions} />
        </div>

        <div className="account-header">
          <h3 className="account-section">Accounts</h3>
          <LinkToken
            fetchAccounts={fetchAccounts}
            fetchTransactions={fetchTransactions}
          />
        </div>
        <hr className='section-linebr' color='#6a6a6a'></hr>
          {accounts.map((account, index) => (
            <div key={index} className="account-data-row">
              <div className="account-data-row__left">
                <img
                  src="/Images/logo.png"
                  alt="Capital One Logo"
                  className="logo"
                />
                <div className="account-data-row__name">
                  {account.accountName} Account
                </div>
              </div>
              <div className="account-data-row__balance">
                {`${startCase(toLower(account.subtype))} • ${currencyFilter(
                  account.current_balance
                )}`}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccountPage;