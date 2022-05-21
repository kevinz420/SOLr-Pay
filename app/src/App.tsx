// Styling
import "./App.css";
import "flowbite";

import { useMemo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { clusterApiUrl } from "@solana/web3.js";

// Components
import { Header } from "./components/Header";
import { Home } from "./pages/Home/Home";

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
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function App() {
  // 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
          <WalletMultiButton/>
          {/* <BrowserRouter>
            <div className="App font-sans bg-gray-100">
              <Header/>
              <div className="h-screen max-w-screen-xl mx-auto bg-gray-100">
                <Switch>
                  <Route path="/" component={Home} />
                </Switch>
              </div>
            </div>
          </BrowserRouter> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
