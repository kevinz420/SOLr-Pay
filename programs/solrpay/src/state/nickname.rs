use anchor_lang::prelude::*;
//use num_derive::*;
//use num_traits::*;

#[account]
pub struct NameKey {
    address: Pubkey
}

impl NameKey {
    pub const ACCOUNT_SIZE: usize = 8 + 32;

    pub fn create_nickname(&mut self, user: Pubkey) -> Result<()> {
        self.address = user;
        Ok(())
    }
}