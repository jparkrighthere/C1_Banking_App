import { useEffect, useState, useCallback, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import AuthContext from './AuthContext'; 

const App = () => {
  const [linkToken, setToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { authToken } = useContext(AuthContext);

  // Set access token
  const onSuccess = useCallback(async (publicToken) => {
    const response = await fetch('/api/set_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify({ public_token: publicToken }),
    });
    const data = response.json()
    console.log(data);

  }, []);

  // Creates a Link token
  const createLinkToken = useCallback(async () => {
    if (window.location.href.includes("?oauth_state_id=")) {
      const token = localStorage.getItem('link_token'); // For OAuth, use previously generated Link token
      setToken(token);
    } else {
      const response = await fetch('/api/create_link_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setToken(data.link_token);
      localStorage.setItem('link_token', data.link_token);
    }
  }, [setToken]);

  //  // Fetch accounts
  //  const fetchAccounts = async () => {
  //   const response = await fetch('/api/accounts', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${authToken}`,
  //     },
  //   });
  //   const data = await response.json();
  //   setAccounts(data);
  // };

  let isOauth = false;
  const config = {
    token:linkToken,
    onSuccess,
  };
  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (linkToken == null) {
      createLinkToken();
    }
    if (isOauth && ready) {
      open();
    }
  }, [createLinkToken,linkToken, isOauth, ready, open]);

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        <strong>Link account</strong>
      </button>
      <button
        onClick={() =>
          fetch('/api/transactions', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then(res=>res.json())
          .then(data=> {
            console.log(data);
            setAccounts(data);
          })
        }
      >
        <strong>Test</strong>
      </button>
      <div>
        {accounts.map((account, index) => (
          <div key={index}>
            <pre>{JSON.stringify(account, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;