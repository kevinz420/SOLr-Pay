use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Username {
    pub user: Pubkey
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Wallet {
    pub username: String,
    pub pfp_cid: String
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Friend {
    pub friend: Pubkey
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Transaction {
    payee: Pubkey,
    amount: u64,
    time: i64,
    content: String
}