use anchor_lang::prelude::*;

#[account]
pub struct Wallet {
    username: String,
    pfp_cid: Vec<u8>,
}

impl Wallet {
    pub const STATIC_SIZE: usize = (8 + 4 + 4);

    pub fn current_name(&self) -> &str {
        &self.username
    }

    pub fn pfp_len(&self) -> usize {
        self.pfp_cid.len()
    }

    pub fn create_wallet(&mut self, uname: String, pfp: Vec<u8>) -> Result<()> {
        self.pfp_cid = pfp;
        self.username = uname;
        Ok(())
    }

    pub fn change_uname(&mut self, uname: String) -> Result<()> {
        self.username = uname;
        Ok(())
    }

    pub fn change_pfp(&mut self, pfp: Vec<u8>) -> Result<()> {
        self.pfp_cid = pfp;
        Ok(())
    }
}