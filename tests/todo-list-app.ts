import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoListApp } from "../target/types/todo_list_app";
import { assert } from "chai";

describe("todo-list-app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TodoListApp as Program<TodoListApp>;
  const author = program.provider as anchor.AnchorProvider;

  it("Is can create a task!", async () => {
    const task = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .addingTask("A task to do later")
      .accounts({
        task: task.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([task])
      .rpc();

    console.log("Your transaction signature", tx);

    const taskAcc = await program.account.task.fetch(task.publicKey);
    console.log("Your task account", taskAcc);

    assert.equal(taskAcc.author.toBase58(), author.wallet.publicKey.toBase58());
    assert.equal(taskAcc.text, "A task to do later");
    assert.equal(taskAcc.isDone, false);
    assert.ok(taskAcc.createdAt);
    assert.ok(taskAcc.updatedAt);
  });
});
