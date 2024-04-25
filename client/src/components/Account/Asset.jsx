/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Cell, LineChart, Line, XAxis, YAxis} from 'recharts'; 
import './Asset.css';
import colors from 'plaid-threads/scss/colors';

function currencyFilter(value) {

  const isNegative = value < 0;
  const displayValue = value < 0 ? -value : value;
  return `${isNegative ? '-' : ''}$${displayValue
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')}`;
}

const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
};

  const colors_list = [
    "#0074D9", // Bright blue
    "#4192D9", // Lighter blue
    "#6BC2E9", // Even lighter blue
    "#8ED5F0", // Pale blue
    "#B2E0F5", // Very pale blue
    "#D9F0FC", // Almost white blue
  ];

const COLORS = [
  colors.yellow900,
  colors.red900,
  colors.blue900,
  colors.green900,
  colors.black1000,
  colors.purple600,
];

export default function NetWorth(props) {
  // transaction data stuff
  const {accounts, transactions, numOfItems} = props

  // line chart data processing
  const transformedData = transactions.map(transaction => ({
    date: new Date(transaction.date).toISOString().slice(0,10),
    amount: transaction.amount,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // sums of account types
  const addAllAccounts = (
    accountSubtypes
  ) =>
    accounts
      .filter(a => accountSubtypes.includes(a.subtype))
      .reduce((acc, val) => acc + val.current_balance, 0);

  const depository= addAllAccounts([
    'checking',
    'savings',
    'cd',
    'money market',
  ]);
  const investment = addAllAccounts(['ira', '401k']);
  const loan = addAllAccounts(['student', 'mortgage']);
  const credit = addAllAccounts(['credit card']);

  const assets = depository + investment;
  localStorage.setItem('cash-in', assets);
  const liabilities = loan + credit;

  return (
    <>
      <h2 className="netWorthHeading">Net Worth</h2>
      <p className='netWorthsubHeading'> A summary of your assets and liabilities </p>
      <>
        <div className="netWorthText">{`Total across ${
            numOfItems
            } bank ${pluralize('account', numOfItems)}:`}</div>
            <h2 className="netWorthDollars"> {currencyFilter(assets)} </h2>
            <hr color='#6a6a6a' className='section-linebr'></hr>

            <div className='lineChartBox'>
              <h4 className='lineChartHeader'>Transaction History</h4>
              <div className='lineChart'>
              <LineChart width={800} height={400} data={transformedData}>
                <XAxis dataKey="date"/>
                <YAxis />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#34d989"/>
              </LineChart>
              </div>
            </div>

            <div className="widgets-container">
                <div className="assetsBox">
                    <div className="holdingsList">
                        <h4 className="holdingsHeading">Assets</h4>
                      <div className="assetsHeaderContainer">
                          <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                      </div>
                      <PieChart width={500} height={300}>
                        <Pie
                          data={accounts.filter(a => ['checking', 'savings', 'cd', 'money market', 'ira', '401k'].includes(a.subtype))}
                          dataKey="current_balance"
                          nameKey="subtype"
                          outerRadius={90}
                          innerRadius={70}
                          label={({ current_balance }) => `${currencyFilter(current_balance)}`}
                          stroke="#242424"
                          cx="50%"
                          cy="50%"
                          paddingAngle={5}
                        >
                          {accounts.filter(a => ['checking', 'savings', 'cd', 'money market', 'ira', '401k'].includes(a.subtype)).map((account, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend
                          layout="vertical"
                          align="left"
                          verticalAlign="middle"
                        />
                      </PieChart>
                    </div>
                </div>
                
                <div className="liabilitiesBox">
                    <div className="holdingsList">
                      <h4 className="holdingsHeading">Liabilities</h4>
                      <div className="assetsHeaderContainer">
                        <h4 className="dollarsHeading">-{currencyFilter(liabilities)}</h4>
                      </div>
                      <PieChart width={500} height={300}>
                        <Pie
                          data={accounts.filter(a => ['student', 'mortgage', 'credit card'].includes(a.subtype)).map(account => ({
                              ...account,
                              current_balance: Math.abs(account.current_balance)
                          }))}
                          dataKey="current_balance"
                          nameKey="subtype"
                          outerRadius={90}
                          innerRadius={70}
                          label={({ current_balance }) => `-${currencyFilter(current_balance)}`}
                          stroke="#242424"
                          cx="50%"
                          cy="50%"
                          paddingAngle={5}
                        >
                          {accounts.filter(a => ['student', 'mortgage', 'credit card'].includes(a.subtype)).map((account, index) => (
                              <Cell key={`cell-${index}`} fill={colors_list[index % colors_list.length]} />
                          ))}
                        </Pie>
                        <Legend
                          layout="vertical"
                          align="left"
                          verticalAlign="middle"
                        />
                      </PieChart>
                    </div>
                </div>

            </div>

        </>
    </>
  );
}

NetWorth.propTypes = {
    accounts: PropTypes.array.isRequired,
    numOfItems: PropTypes.number.isRequired,
};
