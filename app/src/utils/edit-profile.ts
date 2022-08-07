import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default async function editProfile(
  wallet: WalletContextState,
  connection: Connection,
  username?: string,
  oldname?: string,
  pfp?: Buffer
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

  const tx = new Transaction();

  if (username && oldname) {
    const [nickPDA] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("username"),
        anchor.utils.bytes.utf8.encode(oldname),
      ],
      program.programId
    );

    const [updatedNickPDA] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("username"),
        anchor.utils.bytes.utf8.encode(username),
      ],
      program.programId
    );

    tx.add(
      await program.methods
        .changeUsername(username)
        .accounts({
          nickname: nickPDA,
          profile: profilePDA,
          newNickname: updatedNickPDA,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          sysvarRent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction()
    );
  }

  if (pfp) {
    tx.add(
      await program.methods
        .changePfp(pfp)
        .accounts({
          profile: profilePDA,
          user: provider.wallet.publicKey,
        })
        .instruction()
    );
  }

  const signature = await wallet.sendTransaction(tx, connection);
  const latestBlockHash = await connection.getLatestBlockhash();
  
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  });
}
