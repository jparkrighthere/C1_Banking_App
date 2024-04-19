import PropTypes from 'prop-types';
import './Asset.css';

const currencyFilter = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
};

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
  const personalAssetValue = props.personalAssets.reduce((a, b) => {
    return a + b.value;
  }, 0);

  const assets = depository + investment + personalAssetValue;
  const liabilities = loan + credit;


  return (
    <div>
      <h2 className="netWorthHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      {!props.assetsOnly && (
        <>
          <div className="netWorthText">{`Your total across ${
            props.numOfItems
          } bank ${pluralize('account', props.numOfItems)}`}</div>
          <h2 className="netWorthDollars">
            {currencyFilter(assets - liabilities)}
          </h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
              <div className="holdingsList">
                {/* <div className="assetsHeaderContainer">
                  <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                  <Asset userId={props.userId} />
                </div> */}

                <div className="data">
                  {/* 3 columns */}
                  <h4 className="holdingsHeading">Assets</h4>
                  <p>{''}</p>
                  <p>{''}</p>
                  <p className="dataItem">Cash</p>{' '}
                  <p className="dataItem">{currencyFilter(depository)}</p>
                  <p>{''}</p>
                  <p className="dataItem">Investment</p>
                  <p className="dataItem">{currencyFilter(investment)}</p>
                  <p>{''}</p>
                </div>
                <div className="personalAssets">
                    {props.personalAssets.map(asset => (
                        <div className="personalAsset" key={asset.id}>
                            <p className="dataItem">{asset.description}</p>
                            <p className="dataItem">{currencyFilter(asset.value)}</p>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="userDataBox">
              <div className="holdingsList">
                <h4 className="dollarsHeading">
                  {currencyFilter(liabilities)}
                </h4>

                <div className="data">
                  {/* 3 columns */}
                  <h4 className="holdingsHeading">Liabilities</h4>
                  <p>{''}</p>
                  <p>{''}</p>
                  <p className="dataItem">Credit Cards</p>{' '}
                  <p className="dataItem">{currencyFilter(credit)}</p>
                  <p>{''}</p>
                  <p className="dataItem">Loans</p>
                  <p className="dataItem">{currencyFilter(loan)}</p>
                  <p>{''}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {props.assetsOnly && (
        <>
          <h2 className="netWorthDollars">
            {currencyFilter(assets - liabilities)}
          </h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
            <div className="holdingsList">
                {/* <div className="assetsHeaderContainer">
                    <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                    <Asset userId={props.userId} />
                </div> */}
                <div className="data">
                    <p className="title">Assets</p>
                </div>
                <div className="personalAssets">
                    {props.personalAssets.map(asset => (
                        <div className="personalAsset" key={asset.id}> {/* Added key prop */}
                            <p className="dataItem">{asset.description}</p>
                            <p className="dataItem">{currencyFilter(asset.value)}</p>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            </div>
        </>
      )}
    </div>
  );
}

NetWorth.propTypes = {
    personalAssets: PropTypes.array.isRequired,
    accounts: PropTypes.array.isRequired,
    numOfItems: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    assetsOnly: PropTypes.bool.isRequired,
};
