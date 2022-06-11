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

  const friend = new Keypair();

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

    // create friend count buffer
    const buf = Buffer.alloc(2)
    buf.writeUInt16LE(walletState.friendCount)

    const [friendPDA, ] = await PublicKey
    .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("friend"),
            profilePDA.toBuffer(),
            buf
        ],
        solrProgram.programId
    );

    await solrProgram.methods
        .follow(friend.publicKey)
        .accounts({
            profile: profilePDA,
            friend_pda: friendPDA,
            user: signer.publicKey,
        })
        .rpc();

    expect(walletState.friendCount).to.equal(1);
    
    let friendState = await solrProgram.account.friend.fetch(friendPDA);
    
    expect(friendState.address).to.equal(friend.publicKey);
  });
});
