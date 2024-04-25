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
        <div>
            <div className="barChart">
            <BarChart width={400} height={250} data={data}>
                <YAxis />
                <Legend />
                <Bar dataKey="cash-in" fill="#92d4b9" />
                <Bar dataKey="cash-out" fill="#a5cbf8" />
            </BarChart>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cash In:</span>
                    <span>${cashIn.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cash Out:</span>
                    <span>${cashOut.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monthly Savings:</span>
                    <span>${averageSavings.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
