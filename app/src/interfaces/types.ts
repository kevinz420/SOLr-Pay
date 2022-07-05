import { PublicKey } from "@solana/web3.js"

// for redux usage
export interface UserType {
    username : string,
    pfpURL : string
    friends : Array<String>
}

// for react component usage
export interface ProfileType {
    username : string,
    pfpURL : string
}

export interface TxnType {
    payer: {username: string, pfpURL: string},
    payee: {username: string, pfpURL: string},
    amount: number,
    time: string,
    content: string
}