use crate::state::transaction::*;

use anchor_lang::prelude::*;

pub fn pay(ctx: Context<Pay>, amount: u64, content: String) -> Result<()> {
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.from.key(),
        &ctx.accounts.to.key(),
        amount
    );

    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.from.to_account_info(),
            ctx.accounts.to.to_account_info()
        ]
    )?;

    ctx.accounts.txn.initialize(ctx.accounts.from.key(), ctx.accounts.to.key(), amount, content)?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u64, content: String)]
pub struct Pay<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub to: AccountInfo<'info>,
    #[account(
        init,
        payer = from,
        space = Transaction::STATIC_SIZE + content.len()
    )]
    pub txn: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}