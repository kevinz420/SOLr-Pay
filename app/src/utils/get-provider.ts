import { Connection } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { WalletContextState } from '@solana/wallet-adapter-react';
require('@solana/wallet-adapter-react-ui/styles.css');

const commitment = "processed"

export default async function getProvider(wallet: WalletContextState, connection: Connection) {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) throw new WalletNotConnectedError();

    const signerWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
    };

    const provider = new AnchorProvider(
      connection, signerWallet, { preflightCommitment: commitment }
    );
    return provider;
  }