import { PieChart, Pie, Cell, Legend } from "recharts";
import { sampleTransactions } from "./spendingInsightData";
import "./budget.css";
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';


export const DonutChart = (props) => {
    const colors = [
        "#8E24AA", // Light purple
        "#AB47BC", // Slightly lighter purple
        "#CE93D8", // Medium purple
        "#E1BEE7", // Lighter purple
        "#F3E5F5", // Very light purple
        "#F8BBD0", // Almost white purple
    ];

    const transactions = props.data;

    // Create array of objects with category name and transaction amount
    const categoryData = useMemo(() => {
        const result = {};
        transactions.forEach(tx => {
            const categoryName = tx.category[0]; // Get the first category from the list
            if (categoryName && tx.amount > 0) {
                result[categoryName] = (result[categoryName] || 0) + tx.amount;
            }
        });

        // Convert result object to array of objects
        return Object.keys(result).map(categoryName => ({
            name: categoryName,
            amount: Number(result[categoryName].toFixed(2)) // Round amount to 2 decimal places
        }));
    }, [transactions]);

    return (
        <div className="chart">
            <h4 className="widget-header">Top Categories</h4>
            <PieChart width={500} height={300}>
                <Pie
                    data={categoryData}
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
                    {categoryData.map((entry, index) => (
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

DonutChart.propTypes = {
    data: PropTypes.array.isRequired,
};