use anchor_lang::prelude::*;
use crate::error::InputError;

pub mod error;

declare_id!("J6Zcv8Ha8pAwsiF9EpV3CPnksh84BRnufqKoLrMAJYyN");

#[program]
pub mod solrpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _uname: String, _pfp: Vec<u8>) -> Result<()> {
        if (_uname.len()) >= 15 {
            return err!(InputError::LongNickname);
        }
        ctx.accounts.nickname.address = ctx.accounts.user.key();

        let wallet = &mut ctx.accounts.profile;
        wallet.username = _uname;
        wallet.pfp_cid = _pfp;
        wallet.transaction_count = 0;
        wallet.friend_count = 0;
        Ok(())
    }

    // pub fn change_username(ctx: Context<>, _uname: String) -> Result<()> {

    // }
}

#[account]
pub struct NameKey {
    address: Pubkey
}

#[account]
pub struct Wallet {
    username: String,
    pfp_cid: Vec<u8>,
    transaction_count: u32,
    friend_count: u16,
}

#[derive(Accounts)]
#[instruction(_uname: String, _pfp: Vec<u8>)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user,
        space = 8 + 32,
        seeds = [b"username", _uname.as_bytes()], bump
    )]
    pub nickname: Account<'info, NameKey>,
    #[account(
        init,
        payer = user,
        space = 
            8 + 
            4 + _uname.len() + //username space
            4 + _pfp.len() +  //pfp_cid space
            4 + 4,            //count space + 2 bytes
        seeds = [b"wallet", user.key().as_ref()], bump
    )]
    pub profile: Account<'info, Wallet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// #[instruction(_uname: String)]
// pub struct ChangeUsername<'info> {
//     #[account(
//         mut,
//         seeds = [b"username", profile.username.as_bytes()], bump
//     )]
//     pub nickname: Account<'info, NameKey>,
//     #[account(
//         mut,
//         seeds = [b"wallet", user.key().as_ref()], bump
//     )]
//     pub profile: Account<'info, Wallet>,
//     #[account(
//         init,
//         payer = user,
//         space = 8 + 32,
//         seeds = [b"username", _uname.as_bytes()], bump
//     )]
//     pub new_nickname: Account<'info, NameKey>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
//     pub sysvar_rent: Program<'info, Rent>,
// }
