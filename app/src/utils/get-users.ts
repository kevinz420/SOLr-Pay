import getProgram from "./get-program";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function getUsers(
  wallet: WalletContextState,
  connection: Connection,
) {
  const program = await getProgram(wallet, connection);

  return await program.account.wallet.all();
}
