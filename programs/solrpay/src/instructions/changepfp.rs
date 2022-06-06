use crate::state::wallet::*;

use anchor_lang::prelude::*;

pub fn change_pfp(ctx: Context<ChangePfp>, _pfp: Vec<u8>) -> Result<()> {
    ctx.accounts.profile.change_pfp(_pfp)?;
    Ok(())
}

#[derive(Accounts)]
pub struct ChangePfp<'info> {
    #[account(
        mut,
        seeds = ["wallet".as_bytes(), user.key().as_ref()], bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}