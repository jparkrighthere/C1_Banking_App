import React, { useMemo } from 'react';
import { DonutChart } from './donutChart';
import PropTypes from 'prop-types';
import './SpendingInsight.css';
import { BarChartComponent } from './barChart';

const currencyFilter = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

/*
const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
};
*/

export default function SpendingInsight(props) {
    const transactions = props.transactions;
    const sortedTransactions = transactions.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    const recentTransactions = sortedTransactions.slice(-5).reverse(); 

    // getting amount associated with each vendor
    const vendorsArray = useMemo(() => {
        let result = {};
        transactions.forEach(tx => {
            if (tx.merchant_name != null) {
                if (tx.merchant_name in result) {
                    result[tx.merchant_name] += tx.amount;
                } else {
                    result[tx.merchant_name] = tx.amount;
                }
            }
        });
        return result;
    }, [transactions]);

    const topVendors = useMemo(() => {
        let namesArray = Object.entries(vendorsArray).sort((a, b) => b[1] - a[1]);
        namesArray.splice(3); // top 3
        return namesArray;
    }, [vendorsArray]);

    return (
        <>
            <h2 className="monthlySpendingHeading">Spending Insights</h2>
            <p className="tableSubHeading">An overview of your recent spending</p>
            { /*<div className="monthlySpendingText">{`Overall breakdown across ${props.numOfItems} bank ${pluralize('account', props.numOfItems)}`}</div> */}
            <hr color='#6a6a6a' className='widget-linebr'></hr>
            
            <div>
                <div className='row'>
                    <div className="barChartBox">
                        <div className="holdingsList">
                            <h4 className="holdingsHeading">Cash-In and Cash-Out</h4>
                            <BarChartComponent />
                        </div>
                    </div>
                    
                    <div className="transactionsBox">
                        <div className="holdingsList">
                            <h4 className="holdingsHeading">Recent Transactions</h4>
                            <div className="spendingInsightData">
                                {/*<p className="title">Vendor</p> <p className="title">Date</p> */}
                                {recentTransactions.map(tx => (
                                    <div key={tx.name} className='transactionRow'>
                                        <div className='leftColumn'>
                                            <p>{tx.name}</p>
                                            <p className='date'>{new Date(tx.date).toISOString().slice(0,10)}</p>
                                        </div>
                                        <div className='rightColumn'>
                                            <p>{currencyFilter(tx.amount)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <p className='tableSubHeading'>Spending Details</p>
                <hr color='#6a6a6a' className='widget-linebr'></hr>

                <div className='row'>
                    <div className="donutChartBox">
                        <DonutChart data={transactions} />
                    </div>

                    <div className="vendorsBox">
                        <div className="holdingsList">
                            <h4 className="holdingsHeading">Top Places</h4>
                            <div className="spendingInsightData">
                                {/*<p className="title">Vendor</p> <p className="title">Amount</p>*/}
                                {topVendors.map(([vendor, amount], index) => (
                                    <div key={vendor} className='transactionRow'>
                                        <div className='altLeftColumn'>
                                            <p>{`${index + 1}. ${vendor}`}</p>
                                        </div>
                                        <div className='rightColumn'>
                                            <p>{currencyFilter(amount)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

SpendingInsight.propTypes = {
    transactions: PropTypes.array.isRequired,
    numOfItems: PropTypes.number.isRequired,
};
