import { PublicKey } from "@solana/web3.js";

// for redux usage (defines current logged in user)
export interface UserType {
  username: string;
  pfpURL: string;
  friends: { pubkey: string; username: string; pfpURL: string }[];
}

// for react component usage (defines user profile belongs to)
export interface ProfileType {
  username: string;
  pfpURL: string;
}

export interface TxnType {
  payer: { username: string; pfpURL: string };
  payee: { username: string; pfpURL: string };
  amount: number;
  time: string;
  content: string;
}

export interface ToastType {
  visible: boolean;
  isSuccess: boolean;
  text: string;
}

// TS typing of rust accounts
export interface FriendType {
  friends: PublicKey[];
}

export interface NickType {
  address: PublicKey;
}

export interface WalletType {
  username: string;
  pfpCid: Uint8Array;
  friendCount: number;
}
