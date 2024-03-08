import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
};

const Context = createContext(initialState);

const { Provider } = Context;
export const QuickstartProvider = (props) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};

QuickstartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Context;
