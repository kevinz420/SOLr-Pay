import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function getWallet(
  wallet: WalletContextState,
  connection: Connection
) {
  const provider = await getProvider(wallet, connection);
  const program = await getProgram(wallet, connection);

  const [profilePDA] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("wallet"),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  return await program.account.wallet.fetch(profilePDA);
}
