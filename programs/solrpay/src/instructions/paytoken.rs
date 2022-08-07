use crate::state::tokentx::*;

use anchor_lang::prelude::*;

use anchor_spl::token::{TokenAccount, Mint, Token};
use anchor_spl::associated_token::AssociatedToken;

pub fn pay_token(ctx: Context<PayToken>, amount: u64, content: String) -> Result<()> {
    //token transfer
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        anchor_spl::token::Transfer {
            from: ctx.accounts.from_token.to_account_info(),
            to: ctx.accounts.to_token.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
        },
    );

    anchor_spl::token::transfer(cpi_ctx, amount)?;

    ctx.accounts.txn.initialize(ctx.accounts.from.key(), ctx.accounts.to.key(), amount, content, ctx.accounts.mint.key())?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u64, content: String)]
pub struct PayToken<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(
        mut, 
        associated_token::mint = mint,
        associated_token::authority = from,
    )]
    pub from_token: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK: This is fine because we only read from this account
    pub to: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = from,
        associated_token::mint = mint,
        associated_token::authority = to,   
    )]
    pub to_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = from,
        space = TokenTransaction::STATIC_SIZE + content.len()
    )]
    pub txn: Account<'info, TokenTransaction>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}