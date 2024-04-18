import React, { useMemo } from 'react';
import { DonutChart } from './donutChart';
import PropTypes from 'prop-types';
import './SpendingInsight.css';

const currencyFilter = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
};

export default function SpendingInsight(props) {
    const transactions = props.transactions;

    const monthlyTransactions = useMemo(() => {
        const today = new Date();
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return transactions.filter(tx => {
            const date = new Date(tx.date);
            return date > oneMonthAgo &&
                tx.category !== 'Payment' &&
                tx.category !== 'Transfer' &&
                tx.category !== 'Interest';
        });
    }, [transactions]);

    const categoriesData = useMemo(() => {
        let categoriesObject = {};
        monthlyTransactions.forEach(tx => {
            categoriesObject[tx.category] = categoriesObject[tx.category]
                ? categoriesObject[tx.category] + tx.amount
                : tx.amount;
        });
        return Object.keys(categoriesObject).map(key => ({
            name: key,
            value: categoriesObject[key]
        }));
    }, [monthlyTransactions]);

    const namesObject = useMemo(() => {
        let result = {};
        monthlyTransactions.forEach(tx => {
            if (tx.name in result) {
                result[tx.name] += tx.amount;
            } else {
                result[tx.name] = tx.amount;
            }
        });
        return result;
    }, [monthlyTransactions]);

    const sortedNames = useMemo(() => {
        let namesArray = Object.entries(namesObject).sort((a, b) => b[1] - a[1]);
        namesArray.splice(5); // top 5
        return namesArray;
    }, [namesObject]);

    return (
        <div>
            <h2 className="monthlySpendingHeading">Monthly Spending</h2>
            <h4 className="tableSubHeading">A breakdown of your monthly spending</h4>
            <div className="monthlySpendingText">{`Monthly breakdown across ${props.numOfItems} bank ${pluralize('account', props.numOfItems)}`}</div>
            <div className="monthlySpendingContainer">
                <div className="userDataBox">
                    <DonutChart data={categoriesData} />
                </div>
                <div className="userDataBox">
                    <div className="holdingsList">
                        <h4 className="holdingsHeading">Top 5 Vendors</h4>
                        <div className="spendingInsightData">
                            <p className="title">Vendor</p> <p className="title">Amount</p>
                            {sortedNames.map(([vendor, amount]) => (
                                <React.Fragment key={vendor}>
                                    <p>{vendor}</p>
                                    <p>{currencyFilter(amount)}</p>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

SpendingInsight.propTypes = {
    transactions: PropTypes.array.isRequired,
    numOfItems: PropTypes.number.isRequired,
};