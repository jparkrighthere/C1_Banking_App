import { PieChart, Pie, Cell, Legend } from "recharts";
import { sampleTransactions } from "./spendingInsightData";

export const DonutChart = () => {
    const colors = [
        "#034D96",
        "#005BB5",
        "#016BD5",
        "#519DE9",
        "#8BC1F7",
        "#C4E0FC",
    ];

    return (
        <div className="holdingsList">
            <PieChart width={500} height={300}>
                <Pie
                    data={sampleTransactions}
                    dataKey="amount"
                    outerRadius={90}
                    innerRadius={70}
                    label={({ amount }) =>
                        `$ ${amount}`
                    }
                    stroke="#242424"
                    cx="50%"
                    cy="50%"
                    paddingAngle={5}
                >
                    {sampleTransactions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Legend
                layout="vertical"
                align="left"
                verticalAlign="middle"
                />
            </PieChart>
        </div>
    );
};
