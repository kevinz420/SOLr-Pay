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

    let walletState = await solrProgram.account.wallet.fetch(profilePDA);
    const prev = walletState.friendCount

    const [oldPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev).toArrayLike(Buffer, 'le')
        ],
        solrProgram.programId
    );
    
    let oldState = await solrProgram.account.friend.fetch(oldPDA);
    console.log('ORIGINAL ARRAY: ' + oldState.friends)

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev + 1).toArrayLike(Buffer, 'le')
        ],
        solrProgram.programId
    );

    await solrProgram.methods
        .follow(friend.publicKey)
        .accounts({
            profile: profilePDA,
            oldPda: oldPDA,
            friendPda: friendPDA,
            user: signer.publicKey,
        })
        .rpc();
    
    walletState = await solrProgram.account.wallet.fetch(profilePDA);
    expect(walletState.friendCount).to.equal(prev + 1);
    
    let friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('\nNEW ARRAY: ' + friendState.friends)

    expect(friendState.friends[0].toString()).to.equal(friend.publicKey.toString());
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

    let walletState = await solrProgram.account.wallet.fetch(profilePDA);
    const prev = walletState.friendCount

    const [oldPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev).toArrayLike(Buffer, 'le')
        ],
        solrProgram.programId
    );
    
    let oldState = await solrProgram.account.friend.fetch(oldPDA);
    console.log('ORIGINAL ARRAY: ' + oldState.friends)

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            new anchor.BN(prev - 1).toArrayLike(Buffer, 'le')
        ],
        solrProgram.programId
    );

    await solrProgram.methods
        .unfollow(friend.publicKey)
        .accounts({
            profile: profilePDA,
            oldPda: oldPDA,
            friendPda: friendPDA,
            user: signer.publicKey,
        })
        .rpc();
    
    walletState = await solrProgram.account.wallet.fetch(profilePDA);
    expect(walletState.friendCount).to.equal(prev - 1);
    
    let friendState = await solrProgram.account.friend.fetch(friendPDA);
    console.log('\nNEW ARRAY: ' + friendState.friends)

    expect(friendState.friends.toString()).to.not.contain(friend.publicKey.toString());
  })
});
