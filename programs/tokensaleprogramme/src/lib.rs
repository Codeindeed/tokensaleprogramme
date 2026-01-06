use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

declare_id!("ARqYsriT9c7SkSTT4jTaYKkeVGRSfCrB72ntTc8CzwhF");

#[program]
pub mod tokensaleprogramme {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::initialize(ctx)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        instructions::mint::mint_token(ctx, amount)
    }

    pub fn transfer_token(ctx: Context<TransferToken>, amount: u64) -> Result<()> {
        instructions::transfer::transfer_token(ctx, amount)
    }
}

