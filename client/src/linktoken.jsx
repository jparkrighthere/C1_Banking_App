import { useEffect, useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const App = () => {
  const { accessToken } = useAuth();
  const [linkToken, setToken] = useState(null);

  const onSuccess = useCallback(async (publicToken) => {
    const response = await fetch("/api/set_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    const data = await response.json();
    console.log(data);
  }, [accessToken]);

  const createLinkToken = useCallback(async () => {
    if (window.location.href.includes("?oauth_state_id=")) {
      const token = localStorage.getItem("link_token");
      setToken(token);
    } else {
      const response = await fetch("/api/create_link_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setToken(data.link_token);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [accessToken]);

  let isOauth = false;

  const config = {
    token: linkToken,
    onSuccess,
  };

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
  }, [createLinkToken, linkToken, isOauth, ready, open]);

  return (
    <div>
      {accessToken ? (
        <div>
          <button onClick={open} disabled={!ready}>
            <strong>Link account</strong>
          </button>
          <h3>This is the generated token:</h3>
          <h4>{linkToken}</h4>
        </div>
      ) : (
        <p>
          Please{" "}
          <Link to="/register">
            <strong>register</strong>
          </Link>{" "}
          or{" "}
          <Link to="/signin">
            <strong>sign in</strong>
          </Link>
        </p>
      )}
    </div>
  );
};

export default App;
