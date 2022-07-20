use crate::state::nickname::*;
use crate::state::wallet::*;
use crate::state::friend::*;

use anchor_lang::prelude::*;
use crate::error::InputError;

pub fn initialize(ctx: Context<Initialize>, _uname: String, _pfp: Vec<u8>) -> Result<()> {
    if (_uname.len()) > 15 {
        return err!(InputError::LongNickname);
    }
    ctx.accounts.nickname.create_nickname(ctx.accounts.user.key())?;
    ctx.accounts.profile.create_wallet(_uname, _pfp)?;
    ctx.accounts.friend.initialize()?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(_uname: String, _pfp: Vec<u8>)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user,
        space = NameKey::ACCOUNT_SIZE,
        seeds = ["username".as_bytes(), _uname.as_bytes()], bump
    )]
    pub nickname: Account<'info, NameKey>,
    #[account(
        init,
        payer = user,
        space = Wallet::STATIC_SIZE + _pfp.len() + _uname.len(),
        seeds = ["wallet".as_bytes(), user.key().as_ref()], bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(
        init,
        payer = user,
        space = Friend::STATIC_SIZE,
        seeds = ["friend".as_bytes(), profile.key().as_ref()], bump
    )]
    pub friend: Account<'info, Friend>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}