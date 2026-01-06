import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Tokensaleprogramme } from "../target/types/tokensaleprogramme";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { expect } from "chai";

describe("tokensaleprogramme", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .tokensaleprogramme as Program<Tokensaleprogramme>;
  const mint = anchor.web3.Keypair.generate();
  const payer = provider.wallet as anchor.Wallet;

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        mint: mint.publicKey,
        payer: payer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();
    console.log("Initialize transaction signature", tx);
  });

  it("Mint Token", async () => {
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      payer.publicKey
    );

    const tx = await program.methods
      .mintToken(new anchor.BN(1000000000))
      .accountsPartial({
        mint: mint.publicKey,
        tokenAccount: tokenAccount,
        payer: payer.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Mint transaction signature", tx);

    const account = await getAccount(provider.connection, tokenAccount);
    expect(Number(account.amount)).to.equal(1000000000);
  });

  it("Transfer Token", async () => {
    const fromTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      payer.publicKey
    );
    const toWallet = anchor.web3.Keypair.generate();
    const toTokenAccount = await createAssociatedTokenAccount(
        provider.connection,
        payer.payer,
        mint.publicKey,
        toWallet.publicKey
    );
    
    const amountToTransfer = new anchor.BN(500000000);

    const tx = await program.methods
      .transferToken(amountToTransfer)
      .accountsPartial({
        from: fromTokenAccount,
        to: toTokenAccount,
        authority: payer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Transfer transaction signature", tx);

    const toAccount = await getAccount(provider.connection, toTokenAccount);
    expect(Number(toAccount.amount)).to.equal(500000000);
    
    const fromAccount = await getAccount(provider.connection, fromTokenAccount);
    expect(Number(fromAccount.amount)).to.equal(500000000);
  });
});

