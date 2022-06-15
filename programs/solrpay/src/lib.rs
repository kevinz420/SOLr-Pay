use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("5SChqz4YDGnrpto3jHTuzPYyvbcMcVwFDJ3EGzi3aX3L");

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

    pub fn follow(ctx: Context<Follow>, _friend: Pubkey) -> Result<()> {
        instructions::follow::follow(ctx, _friend)
    }

    pub fn unfollow(ctx: Context<Unfollow>, _friend: Pubkey) -> Result<()> {
        instructions::unfollow::unfollow(ctx, _friend)
    }

    pub fn pay(ctx: Context<Pay>, _amount: u64, _content: String) -> Result<()> {
        instructions::pay::pay(ctx, _amount, _content)
    }
}
