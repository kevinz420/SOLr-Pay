import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletType } from "../interfaces/types";

export default async function geetWallets(
  wallet: WalletContextState,
  connection: Connection,
) {
  const program = await getProgram(wallet, connection);

  return await program.account.wallet.all() as unknown as {publicKey: PublicKey, account: WalletType}[];
}
