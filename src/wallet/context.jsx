import { useContext, createContext } from "react";
import { PhantomProvider } from "./PhantomProvider";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const providerValue = PhantomProvider();
  return (
    <WalletContext.Provider value={providerValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);