import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { expect } from 'chai';
import { Solrpay } from '../target/types/solrpay';

describe('solrpay', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
  
    const solrProgram = anchor.workspace.Solrpay as Program<Solrpay>;
    const solrProvider = solrProgram.provider as anchor.AnchorProvider;

    const connection = new Connection("https://api.devnet.solana.com"); //change to mainnet for mainnet
  
    const amount = anchor.web3.LAMPORTS_PER_SOL / 3;  // lamports
    const content: string = "i am literally the coolest";

    const txn = anchor.web3.Keypair.generate();
    const to = anchor.web3.Keypair.generate();

    it('pay!', async() => {
        const signer = solrProvider.wallet;

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
        let payeeBalance = await connection.getBalance(to.publicKey);
        console.log("balance of payee:", payeeBalance);
        console.log("expected_payee:", to.publicKey.toString());
        console.log("written_payee:", txnState.payee.toString());
        //expect(txnState.payee).to.equal(to.publicKey);
        console.log("stored_amount:", txnState.amount);
        console.log("expected_amount:", new anchor.BN(amount));
        //expect(txnState.amount).to.equal(new anchor.BN(amount));
        expect(txnState.content).to.equal(content);
        console.log("timestamp:", txnState.time);
    });

});
