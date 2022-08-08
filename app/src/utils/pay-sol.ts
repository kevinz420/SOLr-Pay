import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function paySol(
  amount: number,
  content: string,
  to: PublicKey,
  wallet: WalletContextState,
  connection: Connection
) {
  const provider = await getProvider(wallet, connection);
  const program = await getProgram(wallet, connection);

  const txn = anchor.web3.Keypair.generate();
  
  await program.methods
    .pay(new anchor.BN(amount * anchor.web3.LAMPORTS_PER_SOL), content)
    .accounts({
      from: provider.wallet.publicKey,
      to: to,
      txn: txn.publicKey,
    })
    .signers([txn])
    .rpc();
}
