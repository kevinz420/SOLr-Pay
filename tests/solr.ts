import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Solr } from "../target/types/solr";

describe("solr", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solr as Program<Solr>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
