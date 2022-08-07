import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair } from '@solana/web3.js';
import { expect } from 'chai';
import { Solrpay } from '../target/types/solrpay';

describe('solrpay', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const solrProgram = anchor.workspace.Solrpay as Program<Solrpay>;
  const solrProvider = solrProgram.provider as anchor.AnchorProvider;

  const friend = anchor.web3.Keypair.generate();
  
  it('follow!', async () => {
    const signer = solrProvider.wallet;

    const [profilePDA, ] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                provider.wallet.publicKey.toBuffer(),
            ],
            solrProgram.programId
        );

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
        ],
        solrProgram.programId
    );
    
    let friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('ORIGINAL ARRAY: ' + friendState.friends);

    await solrProgram.methods
        .follow(friend.publicKey, true)
        .accounts({
            profile: profilePDA,
            friendPda: friendPDA,
            user: signer.publicKey,
        })
        .rpc();
    
    friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('\nNEW ARRAY: ' + friendState.friends);

    let length = friendState.friends.length;
    expect(friendState.friends[length - 1].toString()).to.equal(friend.publicKey.toString());
  });

  it('unfollow!', async () => {
    const signer = solrProvider.wallet;

    const [profilePDA, ] = await PublicKey
        .findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("wallet"),
                provider.wallet.publicKey.toBuffer(),
            ],
            solrProgram.programId
        );

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
        ],
        solrProgram.programId
    );
    
    let friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('ORIGINAL ARRAY: ' + friendState.friends);

    await solrProgram.methods
        .follow(friend.publicKey, false)
        .accounts({
            profile: profilePDA,
            friendPda: friendPDA,
            user: signer.publicKey,
        })
        .rpc();
    
    friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('\nNEW ARRAY: ' + friendState.friends);

    expect(friendState.friends.toString()).to.not.contain(friend.publicKey.toString());
  })
});
