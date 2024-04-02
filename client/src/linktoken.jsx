import { useEffect, useState, useCallback, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import AuthContext from './AuthContext'; 

const App = () => {
  const [linkToken, setToken] = useState(null);
  const { isLoggedIn, logout } = useContext(AuthContext);
  // Set access token
  const onSuccess = useCallback(async (publicToken) => {
    const response = await fetch("/api/set_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      const response = await fetch("/api/create_link_token", {method: "POST"});
      const data = await response.json();
      setToken(data.link_token);
      localStorage.setItem('link_token', data.link_token);
    }
  }, [setToken]);

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
      {isLoggedIn && <button onClick={logout}>Logout</button>}
      <h3>This is the generated token:</h3>
      <h4>{linkToken}</h4>
    </div>
  );
};

export default App;