import Header from "../Header/Header";
import "./budget.css"
import SpendingInsight from "./SpendingInsight";
import { sampleTransactions } from './spendingInsightData.js';

export default function Budget() {
  return (
    <div>
      <Header />
      <div className="donut-widget">
        <SpendingInsight transactions={sampleTransactions} numOfItems={1} />
      </div>
    </div>
  );
}