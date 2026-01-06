use anchor_lang::prelude::*;

declare_id!("ARqYsriT9c7SkSTT4jTaYKkeVGRSfCrB72ntTc8CzwhF");

#[program]
pub mod tokensaleprogramme {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
