import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletType } from "../interfaces/types";

export default async function getWallet(
  wallet: WalletContextState,
  connection: Connection,
  pubkey?: PublicKey
) {
  const program = await getProgram(wallet, connection);

  const [profilePDA] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("wallet"),
      pubkey ? pubkey.toBuffer() : wallet.publicKey!.toBuffer(),
    ],
    program.programId
  );

  return await program.account.wallet.fetch(profilePDA) as unknown as WalletType;
}
