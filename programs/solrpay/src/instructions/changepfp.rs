use crate::state::wallet::*;

use anchor_lang::prelude::*;
use crate::error::InputError;

pub fn change_pfp(ctx: Context<ChangePfp>, _pfp: Vec<u8>) -> Result<()> {
    if _pfp.len() > 42 {
        return err!(InputError::InvalidPfp)
    }
    ctx.accounts.profile.change_pfp(_pfp)?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(_pfp: Vec<u8>)]
pub struct ChangePfp<'info> {
    #[account(
        mut,
        realloc = Wallet::STATIC_SIZE + profile.current_name().len() + _pfp.len(),
        realloc::payer = user,
        realloc::zero = false,
        seeds = ["wallet".as_bytes(), user.key().as_ref()], bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}