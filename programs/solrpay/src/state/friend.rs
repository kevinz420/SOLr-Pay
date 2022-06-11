use anchor_lang::prelude::*;

#[account]
pub struct Friend {
    address: Pubkey
}

impl Friend {
    pub const ACCOUNT_SIZE: usize = 8 + 32;

    pub fn create_friend(&mut self, friend: Pubkey) -> Result<()> {
        self.address = friend;
        Ok(())
    }
}