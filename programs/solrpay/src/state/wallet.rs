use anchor_lang::prelude::*;

#[account]
pub struct Wallet {
    username: String,
    pfp_cid: Vec<u8>,
    transaction_count: u32,
    friend_count: u16,
}

impl Wallet {
    pub const STATIC_SIZE: usize = (8 + 4 + 15 + 4 + 4 + 2);

    pub fn create_wallet(&mut self, uname: String, pfp: Vec<u8>) -> Result<()> {
        self.friend_count = 0;
        self.transaction_count = 0;
        self.pfp_cid = pfp;
        self.username = uname;
        Ok(())
    }
}