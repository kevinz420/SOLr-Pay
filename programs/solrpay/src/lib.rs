use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("2EfZqJz8DaDWdiB8oNGTYWjgKbsgNEuSKzg2EN6DqbeN");

#[program]
pub mod solrpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _uname: String, _pfp: Vec<u8>) -> Result<()> {
        instructions::initialize::initialize(ctx, _uname, _pfp)
    }

    // pub fn change_username(ctx: Context<>, _uname: String) -> Result<()> {
    //     if (_uname.len()) >= 12 {
    //         return err!(InputError::LongNickname);
    //     }
    // }
}

// #[derive(Accounts)]
// #[instruction(_uname: String)]
// pub struct ChangeUsername<'info> {
//     #[account(
//         mut,
//         close = user,
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
