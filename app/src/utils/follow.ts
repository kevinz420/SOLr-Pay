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

    let walletState = await program.account.wallet.fetch(profilePDA);
    const prev = walletState.friendCount as number

    const [oldPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev).toArrayLike(Buffer, 'le')
        ],
        program.programId
    );

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev + 1).toArrayLike(Buffer, 'le')
        ],
        program.programId
    );

    await program.methods
        .follow(friend)
        .accounts({
            profile: profilePDA,
            oldPda: oldPDA,
            friendPda: friendPDA,
            user: provider.wallet.publicKey,
        })
        .rpc();
}
