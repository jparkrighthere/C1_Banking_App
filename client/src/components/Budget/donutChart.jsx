import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { data } from "./donutChartData";

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
        <div
            style={{
                textAlign: "center",
                margin: "auto 10%",
            }}
        >
            <PieChart width={500} height={300}>
                <Pie
                    data={data}
                    dataKey="value"
                    outerRadius={90}
                    innerRadius={70}
                    label={({ value }) =>
                        `$${value}`
                    }
                    stroke="#242424"
                    cx="50%"
                    cy="50%"
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
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
