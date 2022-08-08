use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("J2tPvtCtZ81u9QFZMi2ATVWnKVWjRU4P7TbJ1Q4wudMK");

#[program]
pub mod solrpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _uname: String, _pfp: Vec<u8>) -> Result<()> {
        instructions::initialize::initialize(ctx, _uname, _pfp)
    }

    pub fn change_username(ctx: Context<ChangeUsername>, _uname: String) -> Result<()> {
        instructions::changename::change_username(ctx, _uname)
    }

    pub fn change_pfp(ctx: Context<ChangePfp>, _pfp: Vec<u8>) -> Result<()> {
        instructions::changepfp::change_pfp(ctx, _pfp)
    }

    pub fn follow(ctx: Context<Follow>, _friend: Pubkey, _add: bool) -> Result<()> {
        instructions::follow::follow(ctx, _friend, _add)
    }

    pub fn pay(ctx: Context<Pay>, _amount: u64, _content: String) -> Result<()> {
        instructions::pay::pay(ctx, _amount, _content)
    }

    pub fn pay_token(ctx: Context<PayToken>, _amount: u64, _content: String) -> Result<()> {
        instructions::paytoken::pay_token(ctx, _amount, _content)
    }
}
