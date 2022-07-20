use crate::state::wallet::*;
use crate::state::friend::*;

use anchor_lang::prelude::*;

pub fn follow(ctx: Context<Follow>, friend: Pubkey, add: bool) -> Result<()> {
    if add {
        ctx.accounts.friend_pda.add_friend(friend)?;
    } else {
        ctx.accounts.friend_pda.remove_friend(&friend)?;
    }
    Ok(())
}

#[derive(Accounts)]
#[instruction(friend: Pubkey, add: bool)]
pub struct Follow<'info> {
    #[account(
        mut,
        seeds = ["wallet".as_bytes(), user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(
        mut,
        realloc = Friend::STATIC_SIZE + (32*(friend_pda.update_fcount(add))),
        realloc::payer = user,
        realloc::zero = false,
        seeds = ["friend".as_bytes(), profile.key().as_ref()],
        bump
    )]
    pub friend_pda: Account<'info, Friend>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}