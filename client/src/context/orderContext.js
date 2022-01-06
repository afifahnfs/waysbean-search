import { createContext, useMemo, useReducer, useState } from "react";

export const OrderContext = createContext({
  orderMenus: {
    carts: [
      {
        item: {},
        qty: 0,
      },
    ],
    subtotal: 0,
  },
  setOrderMenus: () => {},
});

export const OrderContextProvider = ({ children }) => {
  const [orderMenus, setOrderMenus] = useState({
    carts: [],
    subtotal: 0,
  });
  const value = useMemo(
    () => ({
      orderMenus,
      setOrderMenus,
    }),
    [orderMenus]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
