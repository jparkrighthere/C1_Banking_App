import { BarChart, YAxis, Bar, Legend } from "recharts";
import "./budget.css";

export const BarChartComponent = () => {
    const cashOut =localStorage.getItem("cash-out");
    const cashIn = localStorage.getItem("cash-in");
    const averageSavings = cashIn - cashOut;
    const data = [
        { "cash-in": cashIn, "cash-out": cashOut }
    ];
    return (
        <div className="chart">
            <BarChart width={400} height={250} data={data}>
                <YAxis />
                <Legend />
                <Bar dataKey="cash-in" fill="#8884d8" />
                <Bar dataKey="cash-out" fill="#82ca9d" />
            </BarChart>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>Cash In:</strong></span>
                    <span>${cashIn.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>Cash Out:</strong></span>
                    <span>${cashOut.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>Monthly Savings:</strong></span>
                    <span>${averageSavings.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
