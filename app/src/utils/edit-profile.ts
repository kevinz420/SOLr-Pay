import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
const sendAndConfirmTransaction = require("@solana/web3.js");

export default async function editProfile(
  wallet: WalletContextState,
  connection: Connection,
  username?: string,
  oldname?: string,
  pfp?: Buffer
) {
  let empty: boolean = true;
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

    if (username !== oldname) {
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
      empty = false;
    }
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
    empty = false;
  }

  if (empty) {
    //maybe return an error on frontend since they entered nothing
  } else {
    const txid = await sendAndConfirmTransaction(connection, tx, [provider.wallet.publicKey], {    //not sure if this will work, this uses *solana web3.js
      skipPreflight: true,
      preflightCommitment: "confirmed",
      confirmation: "confirmed",
    });

    //^ if this doesn't work, replace it with:
    // const txid = await sendAndConfirmTransaction(connection, tx, [provider.wallet.publicKey]);
  
    //optional log if needed
    //console.log(`http://explorer.solana.com/tx/${txid}?cluster=devnet`)
  }
}
