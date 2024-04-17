import Header from "../Header/Header";
// import { DonutChart } from "./donutChart.jsx";
import "./budget.css"
import SpendingInsight from "./SpendingInsight";
import { sampleTransactions } from './spendingInsightData.js';

export default function Budget() {
  return (
    <div>
      <Header />
      {/* <hr className="top-line-break"></hr> */}
      <div className="donut-widget">
        <SpendingInsight transactions={sampleTransactions} numOfItems={1} />
      </div>
    </div>
  );
}