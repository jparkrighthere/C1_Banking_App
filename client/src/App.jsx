import { useEffect, useContext, useCallback } from "react";
import Context from "./Context";
import Link from "./components/Link";

const App = () => {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } = useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation = data.products.includes("payment_initiation");
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
      },
    });
    return { paymentInitiation };
  }, [dispatch]);

  const generateToken = useCallback(
    async (isPaymentInitiation) => {
      const path = isPaymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data && data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo();
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, getInfo]);

  return (
    <div>
      <div>
        {linkSuccess && isPaymentInitiation && isItemAccess}
            {/* {isPaymentInitiation}
            {isItemAccess} */}
            <Link />
      </div>
    </div>
  );
};

export default App;
