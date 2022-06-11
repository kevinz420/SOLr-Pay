use crate::state::nickname::*;
use crate::state::wallet::*;
use crate::state::friend::*;

use anchor_lang::prelude::*;
use crate::error::InputError;

pub fn follow(ctx: Context<Follow>, friend: Pubkey) -> Result<()> {
    ctx.accounts.friend_pda.create_friend(friend)?;
    ctx.accounts.profile.incr_friends()?;
    Ok(())
}

#[derive(Accounts)]
pub struct Follow<'info> {
    #[account(
        mut,
        seeds = [b"wallet", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(
        init,
        payer = user,
        space = Friend::ACCOUNT_SIZE,
        seeds = [b"friend", profile.key().as_ref(), profile.friend_count], bump
    )]
    pub friend_pda: Account<'info, Friend>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}