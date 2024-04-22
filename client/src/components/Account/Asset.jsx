import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Cell } from 'recharts'; 
import './Asset.css';
import colors from 'plaid-threads/scss/colors';

const currencyFilter = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
};

const COLORS = [
  colors.yellow900,
  colors.red900,
  colors.blue900,
  colors.green900,
  colors.black1000,
  colors.purple600,
];

export default function NetWorth(props) {
  // sums of account types
  const addAllAccounts = (
    accountSubtypes
  ) =>
    props.accounts
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
  const liabilities = loan + credit;

  return (
    <div>
      <h2 className="netWorthHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      <>
        <div className="netWorthText">{`Your total across ${
            props.numOfItems
            } bank ${pluralize('account', props.numOfItems)}`}</div>
            <h2 className="netWorthDollars">
            {currencyFilter(assets + liabilities)}
            </h2>
            <div className="holdingsContainer">
                <div className="userDataBox">
                    <div className="holdingsList">
                        <h4 className="holdingsHeading">Assets</h4>
                      <div className="assetsHeaderContainer">
                          <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                      </div>
                      <PieChart width={500} height={300}>
                          <Pie
                              data={props.accounts.filter( a => a.current_balance >= 0)}
                              dataKey="current_balance"
                              nameKey="subtype"
                              outerRadius={90}
                              innerRadius={70}
                              label={({ current_balance }) =>
                                  `$ ${current_balance}`
                              }
                              stroke="#242424"
                              cx="50%"
                              cy="50%"
                              paddingAngle={5}
                            >
                              {props.accounts.filter( a => a.current_balance >= 0).map((subtype, index) => (
                                  <Cell key={`cell-${subtype}`} fill={COLORS[index % COLORS.length]} />
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
                <div className="userDataBox">
                    <div className="holdingsList">
                      <h4 className="holdingsHeading">Liabilities</h4>
                      <div className="assetsHeaderContainer">
                        <h4 className="dollarsHeading">{currencyFilter(liabilities)}</h4>
                      </div>
                      <PieChart width={500} height={300}>
                          <Pie
                             data={props.accounts.filter(a => a.current_balance < 0).map(account => ({
                              ...account,
                              current_balance: Math.abs(account.current_balance)
                              }))}
                              dataKey="current_balance"
                              nameKey="subtype"
                              outerRadius={90}
                              innerRadius={70}
                              label={({ current_balance }) =>
                                  `$ -${current_balance}`
                              }
                              stroke="#242424"
                              cx="50%"
                              cy="50%"
                              paddingAngle={5}
                            >
                              {props.accounts.filter( a => a.current_balance < 0).map((entry, index) => (
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
            </div>
        </>
    </div>
  );
}

NetWorth.propTypes = {
    accounts: PropTypes.array.isRequired,
    numOfItems: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
};