use anchor_lang::prelude::*;
use crate::error::InputError;

#[account]
pub struct Wallet {
    username: String,
    pfp_cid: Vec<u8>,
    transaction_count: u32,
    friend_count: u16,
}

impl Wallet {
    pub const STATIC_SIZE: usize = (8 + 4 + 15 + 4 + 4 + 2);

    pub fn current_name(&self) -> &str {
        &self.username
    }

    pub fn create_wallet(&mut self, uname: String, pfp: Vec<u8>) -> Result<()> {
        self.friend_count = 0;
        self.transaction_count = 0;
        self.pfp_cid = pfp;
        self.username = uname;
        Ok(())
    }

    pub fn change_uname(&mut self, uname: String) -> Result<()> {
        self.username = uname;
        Ok(())
    }

    pub fn change_pfp(&mut self, pfp: Vec<u8>) -> Result<()> {
        if pfp.len() > self.pfp_cid.len() {
            return err!(InputError::LongPfp)
        }
        self.pfp_cid = pfp;
        Ok(())
    }

    pub fn incr_friends(&mut self) -> Result<()> {
        self.friend_count += 1;
        Ok(())
    }
}