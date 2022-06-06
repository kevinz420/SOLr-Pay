use crate::state::nickname::*;
use crate::state::wallet::*;

use anchor_lang::prelude::*;
use crate::error::InputError;

pub fn change_username(ctx: Context<ChangeUsername>, _uname: String) -> Result<()> {
    if _uname.len() > 15 {
        return err!(InputError::LongNickname);
    }
    ctx.accounts.profile.change_uname(_uname)?;
    ctx.accounts.new_nickname.create_nickname(ctx.accounts.user.key())?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(_uname: String)]
pub struct ChangeUsername<'info> {
    #[account(
        mut,
        close = user,
        seeds = ["username".as_bytes(), profile.current_name().as_bytes()], bump  //idk if this works
    )]
    pub nickname: Account<'info, NameKey>,
    #[account(
        mut,
        seeds = ["wallet".as_bytes(), user.key().as_ref()], bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(
        init,
        payer = user,
        space = 8 + 32,
        seeds = ["username".as_bytes(), _uname.as_bytes()], bump
    )]
    pub new_nickname: Account<'info, NameKey>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub sysvar_rent: Sysvar<'info, Rent>,
}
