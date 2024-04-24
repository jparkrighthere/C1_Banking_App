import Header from "../Header/Header";
import SpendingInsight from "./SpendingInsight";
import { sampleTransactions } from './spendingInsightData.js';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../AuthContext';

export default function Budget() {
  // transaction data stuff
  const { authToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const response = await fetch('/api/transactions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    console.log("budget transactions obtained");
    setTransactions(data);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Header />
      <div>
        <SpendingInsight transactions={transactions} numOfItems={1} />
      </div>
    </>
  );
}