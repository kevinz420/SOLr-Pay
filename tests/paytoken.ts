import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { expect } from 'chai';
import { Solrpay } from '../target/types/solrpay';
import { getMint, ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, 
    createMint, mintTo, getAssociatedTokenAddress, getAccount} from '@solana/spl-token';

describe('solrpay', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
  
    const solrProgram = anchor.workspace.Solrpay as Program<Solrpay>;
    const solrProvider = solrProgram.provider as anchor.AnchorProvider;

    const connection = new Connection("https://api.devnet.solana.com"); //change to mainnet for mainnet
  
    const content: string = "iamg";

    const txn = anchor.web3.Keypair.generate();
    const to = anchor.web3.Keypair.generate();

    it('pay_token!', async() => {
        const signer = solrProvider.wallet;

        const payer = Keypair.generate();
        const mintAuthority = Keypair.generate();

        const airdropSignature = await connection.requestAirdrop(
            payer.publicKey,
            2*LAMPORTS_PER_SOL,
        );

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        });
    
        const mint = await createMint(
            connection,
            payer,
            mintAuthority.publicKey,
            payer.publicKey,
            9 // We are using 9 to match the CLI decimal default exactly
        );

        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );
          
        console.log(tokenAccount.address.toBase58());

        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            mintAuthority,
            100000000000 // because decimals for the mint are set to 9 (100 tokens)
        );

        console.log(mint.toBase58());

        const mintInfo = await getMint(connection, mint);
        const LAMPORTS_PER_MINT = Math.pow(10, mintInfo.decimals);

        const test = await getAssociatedTokenAddress(
            mint,
            to.publicKey,
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        )

        console.log(test.toBase58())

        const toATA = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            to.publicKey,
        );

        await solrProgram.methods
                .payToken(
                    new anchor.BN(2*LAMPORTS_PER_MINT),
                    content
                )
                .accounts({
                    from: payer.publicKey,
                    fromToken: tokenAccount.address,
                    to: to.publicKey,
                    toToken: toATA.address,
                    mint: mint,
                    txn: txn.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers(
                    [txn, payer]
                )
                .rpc();

        let txnState = await solrProgram.account.tokenTransaction.fetch(txn.publicKey);
        let payeeBalance = await getAccount(
            connection,
            toATA.address,
        );

        console.log(toATA.address.toBase58());
        //expect(payeeBalance.amount).to.equal(2*LAMPORTS_PER_MINT);

        console.log("balance of payee:", payeeBalance.amount.toString());
        console.log("expected_payee:", to.publicKey.toString());
        console.log("written_payee:", txnState.payee.toString());
        //expect(txnState.payee).to.equal(to.publicKey);
        console.log("stored_amount:", txnState.amount);
        console.log("expected_amount:", new anchor.BN(2*LAMPORTS_PER_MINT));
        //expect(txnState.amount).to.equal(new anchor.BN(amount));
        expect(txnState.content).to.equal(content);
        console.log("timestamp:", txnState.time);
    });

});
