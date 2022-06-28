// Styling
import "@solana/wallet-adapter-react-ui/styles.css";
import "flowbite";

import { useAppSelector } from "./redux/app/hooks";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { clusterApiUrl } from "@solana/web3.js";

// Components
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import {Signup} from "./pages/Signup"
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile"
import { Payment } from "./pages/Payment/Payment"

// Wallet-Adapter
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// below is mostly magical wallet routing stuff
function App() {
  const network = WalletAdapterNetwork.Devnet; // 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const user = useAppSelector((state) => state.user);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="App font-sans bg-gray-100">
              <Header/>
              <div className="max-w-screen-xl mx-auto bg-gray-100">
                <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/welcome" element={user.username === "" ? <Signup/> : <Navigate to="/settings" />}/>
                  <Route path="/payment" element={ user.username === "" ? <Navigate to="/welcome" /> : <Payment /> }/>
                  <Route path="/settings" element={ user.username === "" ? <Navigate to="/welcome" /> : <Settings/>}/>
                  <Route path="/users/:handle" element={<Profile/>}/>
                  <Route path="*" element={<h1>404 Page Not Found</h1> } />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;