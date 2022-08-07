import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from '@solana/wallet-adapter-react';

export default async function follow(friend: PublicKey, wallet: WalletContextState, connection: Connection) {
  const provider = await getProvider(wallet, connection);
  const program = await getProgram(wallet, connection);

    const [profilePDA, ] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                provider.wallet.publicKey.toBuffer(),
            ],
            program.programId
        );

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
        ],
        program.programId
    );

    await program.methods
        .follow(friend, true)
        .accounts({
            profile: profilePDA,
            friendPda: friendPDA,
            user: provider.wallet.publicKey,
        })
        .rpc();
}
