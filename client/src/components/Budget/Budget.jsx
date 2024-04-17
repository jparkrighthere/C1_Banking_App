import Header from "../Header/Header";
import { DonutChart } from "./donutChart.jsx";
import "./budget.css"

export default function Budget() {
  return (
    <div>
      <Header />
      <div className="page-title">
        <h2>Budget</h2>
        <p>Spending Details at a glance</p>
      </div>
      <hr className="top-line-break"></hr>
      <div>
        
        <div className="donut-widget">
          <p className="widget-title">Spending Overview</p>
          <DonutChart />
        </div>
      </div>
    </div>
  );
}