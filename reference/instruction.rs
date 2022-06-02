use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_program, sysvar,
};
use spl_associated_token_account;

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum SolrInstruction {
    /// Initializes a new user.
    ///
    /// Creates new username account and wallet account
    /// for the given user.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[writable]` (PDA) username account
    ///   2. `[writable]` (PDA) wallet account
    ///   3. `[]` system program
    ///
    Initialize {
         username: String,
         pfp_cid: u64
    },

    /// Changes a user's username.
    ///
    /// Deletes user's current username account and
    /// creates a new username account with seed
    /// 'username'. Updates the wallet account.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[writable]` (PDA) username account
    ///   2. `[writable]` (PDA) wallet account
    ///   3. '[writable]' (PDA) new username account
    ///   4. `[]` system program
    ///   5. `[]` sysvar rent
    ///
    ChangeUsername { username: String },
    
    /// Changes a user's profile picture.
    ///
    /// Updates the wallet account with the
    /// new profile picture's IPFS CID.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[writable]` (PDA) wallet account
    ///   2. '[]' system program
    ///
    ChangePfp { pfp_cid: u64 },

    /// Follow another wallet account.
    ///
    /// Creates new friend account that is
    /// owned by user's wallet account
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[writable]` (PDA) wallet account  ***quick note: not sure if this needs to be signer, since it owns friend acc
    ///   2. `[writable]` (PDA) friend account
    ///   3. `[]` system program
    ///   4. `[]` sysvar rent
    ///
    Follow { friend: Pubkey },

    /// Unfollow another wallet account.
    ///
    /// Deletes friend account associated
    /// with Pubkey 'friend'.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[writable]` (PDA) wallet account
    ///   2. `[writable]` (PDA) friend account
    ///   3. '[]' system program
    ///   4. '[]' sysvar rent
    ///
    Unfollow { friend: Pubkey },

    /// Pay another Solana wallet.
    ///
    /// Sends SOL to another wallet and creates
    /// an associated transaction account.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable, signer]` user
    ///   1. `[]` payee
    ///   2. `[writable]` (PDA) wallet account
    ///   3. `[writable]` transaction account
    ///   4. `[]` system program
    ///   5. `[]` sysvar rent
    ///   6. `[]` solana token program
    ///   7. `[]` associated token program
    ///
    Pay {
        amount: u64,
        content: String
    }
}