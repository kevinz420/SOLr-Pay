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
  
    const amount = 1;  // lamports
    const content = "hey lol"

    it('pay!', async() => {
        const signer = solrProvider.wallet;
        const txn = anchor.web3.Keypair.generate();
        const to = anchor.web3.Keypair.generate();

        await solrProgram.methods
                .pay(
                    new anchor.BN(amount),
                    content
                )
                .accounts({
                    from: signer.publicKey,
                    to: to.publicKey,
                    txn: txn.publicKey
                })
                .signers(
                    [txn]
                )
                .rpc();

        let txnState = await solrProgram.account.transaction.fetch(txn.publicKey);
        expect(txnState.payee).to.equal(to.publicKey);
        expect(txnState.amount).to.equal(amount);
        expect(txnState.content).to.equal(content);
        console.log("timestamp:", txnState.time)
    });

});
