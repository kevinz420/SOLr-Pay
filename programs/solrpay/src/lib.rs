use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("G2FrpvYmW4z8uTts7JC38ucDQ9UqEnn2jEv3XwP7tngB");

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
}
