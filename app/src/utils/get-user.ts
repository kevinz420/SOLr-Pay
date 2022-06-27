import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function getUsername(
  wallet: WalletContextState,
  connection: Connection,
  username: string
) {
  const program = await getProgram(wallet, connection);

  const [nickPDA] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("username"),
      anchor.utils.bytes.utf8.encode(username),
    ],
    program.programId
  );

  return await program.account.nameKey.fetch(nickPDA);
}
