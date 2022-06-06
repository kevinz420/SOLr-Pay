import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';
import { Solrpay } from '../target/types/solrpay';

describe('solrpay', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const solrProgram = anchor.workspace.Solrpay as Program<Solrpay>;
  const solrProvider = solrProgram.provider as anchor.AnchorProvider;

  const nick: string = "varun>>>kevin";     //user input

  it('change_username!', async() => {
    const signer = solrProvider.wallet;

    const [updatedNickPDA, updatedBump] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("username"),
                anchor.utils.bytes.utf8.encode(nick),
            ],
            solrProgram.programId
        );

    //ADD a check to see if this new nickname is even available (as in account uninitialized
    
    const [profilePDA, _] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                provider.wallet.publicKey.toBuffer(),
            ],
            solrProgram.programId
        );

    let walletState = await solrProgram.account.wallet.fetch(profilePDA);
    let oldName = walletState.username;

    const [nickPDA, nickBump] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("username"),
                anchor.utils.bytes.utf8.encode(oldName),
            ],
            solrProgram.programId
        );

    await solrProgram.methods
        .changeUsername(
            nick
        )
        .accounts({
            nickname: nickPDA,
            profile: profilePDA,
            newNickname: updatedNickPDA,
            user: signer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            sysvarRent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

    let nameState = await solrProgram.account.nameKey.fetch(updatedNickPDA);
    walletState = await solrProgram.account.wallet.fetch(profilePDA);
    expect(nameState.address.toBytes).to.equal(signer.publicKey.toBytes);

    expect(walletState.username).to.equal(nick);

    console.log("stored key:", nameState.address.toString());
    console.log("actual key:", signer.publicKey.toString());

  });
});