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
  
    const newpfp = Buffer.from([2, 4, 5]);  //user input

    it('changepfp!', async() => {
        const signer = solrProvider.wallet;

        const [profilePDA, _] = await PublicKey
            .findProgramAddress(
                [
                    anchor.utils.bytes.utf8.encode("wallet"),
                    provider.wallet.publicKey.toBuffer(),
                ],
                solrProgram.programId
            );

        let oldWalletState = await solrProgram.account.wallet.fetch(profilePDA);
        console.log("old_pfp:", oldWalletState.pfpCid);

        await solrProgram.methods
                .changePfp(
                    newpfp
                )
                .accounts({
                    profile: profilePDA,
                    user: signer.publicKey,
                })
                .rpc();

        let walletState = await solrProgram.account.wallet.fetch(profilePDA);
        
        console.log("new_pfp:", walletState.pfpCid)
        console.log("input_pfp:", newpfp)
    });

});
