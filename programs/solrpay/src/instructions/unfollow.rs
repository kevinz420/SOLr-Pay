use crate::state::wallet::*;
use crate::state::friend::*;

use anchor_lang::prelude::*;

pub fn unfollow(ctx: Context<Unfollow>, friend: Pubkey) -> Result<()> {
    let vec = ctx.accounts.old_pda.get_vec()?;
    ctx.accounts.friend_pda.remove_friend(&vec, friend)?;
    ctx.accounts.profile.decr_friends()?;
    Ok(())
}

#[derive(Accounts)]
pub struct Unfollow<'info> {
    #[account(
        mut,
        seeds = [b"wallet", user.key().as_ref()],
        constraint = profile.get_fcount()? > 0,
        bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(
        mut,
        close = user,
        seeds = [b"friend", profile.key().as_ref(), &[profile.get_fcount()? as u8]],
        bump
    )]
    pub old_pda: Account<'info, Friend>,
    #[account(
        init,
        payer = user,
        space = (Friend::STATIC_SIZE + (profile.get_fcount()? - 1) * 32).into(),
        seeds = [b"friend", profile.key().as_ref(), &[(profile.get_fcount()? - 1) as u8]],
        bump
    )]
    pub friend_pda: Account<'info, Friend>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}