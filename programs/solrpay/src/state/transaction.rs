use anchor_lang::prelude::*;

#[account]
pub struct Transaction {
    payee: Pubkey, // 32 bytes
    amount: u64, // 8 bytes
    time: i64, // 8 bytes
    content: String // 4 additional bytes
}

impl Transaction {
    // discriminator - 8 bytes
    pub const STATIC_SIZE: usize = 8 + 32 + 8 + 8 + 4;
    
    pub fn initialize(&mut self, _payee: Pubkey, _amount: u64, _content: String) -> Result<()> {
        let clock: Clock = Clock::get()?;

        self.payee = _payee;
        self.amount = _amount;
        self.time = clock.unix_timestamp;
        self.content = _content;
        Ok(())
    }
}