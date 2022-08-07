import getProvider from "./get-provider";
import getProgram from "./get-program";
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { getMint,
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction} from "@solana/spl-token";

export default async function pay_token(
    amount: number,
    content: string,
    to: PublicKey,
    mint: PublicKey,
    wallet: WalletContextState,
    connection: Connection,
) {
    const provider = await getProvider(wallet, connection);
    const program = await getProgram(wallet, connection);
    let toATA;

    const txn = anchor.web3.Keypair.generate();

    const fromATA = await getAssociatedTokenAddress(
        mint,
        provider.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    try {
        toATA = await getAssociatedTokenAddress(
            mint,
            to,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );
    } catch(err) {
        createAssociatedTokenAccountInstruction
    }

    const mintInfo = await getMint(connection, mint, undefined, TOKEN_PROGRAM_ID);
    const LAMPORTS_PER_MINT = Math.pow(10, mintInfo.decimals);

    await program.methods
        .payToken(
            new anchor.BN(amount*LAMPORTS_PER_MINT),
            content,
        )
        .accounts({
            from: provider.wallet.publicKey,
            fromToken: fromATA,
            to: to,
            toToken: toATA,
            txn: txn.publicKey,
            systemProgram: SystemProgram.programId,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
}
