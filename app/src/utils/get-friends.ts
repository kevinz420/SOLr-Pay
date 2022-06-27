import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function getFriends(
  wallet: WalletContextState,
  connection: Connection,
  counter: number,
  pk: PublicKey,
) {
  const program = await getProgram(wallet, connection);
  
  const [profilePDA] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                pk.toBuffer(),
            ],
            program.programId
        );

  const [friendPDA] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(counter).toArrayLike(Buffer, 'le')
        ],
        program.programId
    );

  return await program.account.friend.fetch(friendPDA);
}
