import Header from "../Header/Header";
import SpendingInsight from "./SpendingInsight";
import { sampleTransactions } from './spendingInsightData.js';

export default function Budget() {
  return (
    <>
      <Header />
      <div>
        <SpendingInsight transactions={sampleTransactions} numOfItems={1} />
      </div>
    </>
  );
}