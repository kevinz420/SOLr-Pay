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

  const nick: string = "varun";   //user inputs for testing
  const pfp = Buffer.from([1, 2, 3]);

  it('initialize!', async () => {
    const signer = solrProvider.wallet;

    const [nickPDA, nickBump] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("username"),
                anchor.utils.bytes.utf8.encode("varun"),
            ],
            solrProgram.programId
        );

    const [profilePDA, _] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                provider.wallet.publicKey.toBuffer(),
            ],
            solrProgram.programId
        );
    
    await solrProgram.methods
        .initialize(
            "varun", 
            pfp,
        )
        .accounts({
            nickname: nickPDA,
            profile: profilePDA,
            user: signer.publicKey,
        })
        .rpc();

    let nameState = await solrProgram.account.nameKey.fetch(nickPDA);
    expect(nameState.address.toBytes).to.equal(signer.publicKey.toBytes);

    console.log("stored key:", nameState.address);
    console.log("actual key:", signer.publicKey);


    let walletState = await solrProgram.account.wallet.fetch(profilePDA);
    expect(walletState.transactionCount).to.equal(0);
    expect(walletState.friendCount).to.equal(0);
    //expect(walletState.pfpCid).to.equal(pfp);

    console.log("pfp_cid:", walletState.pfpCid);
    console.log("actual pfp:", pfp);

    expect(walletState.username).to.equal(nick);
  });
});
