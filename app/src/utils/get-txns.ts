import getProgram from "./get-program";
import { Connection, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import getWallet from "./get-wallet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const pubkeyToUser = async (
  pk: PublicKey,
  isPayer: boolean,
  wallet: WalletContextState,
  connection: Connection
) => {
  if (pk.toString() === wallet.publicKey!.toString())
    return { username: "You", pfpURL: "" };

  const user = await getWallet(wallet, connection, pk);

  return {
    username: user.username as string,
    pfpURL: isPayer
      ? `https://ipfs.infura.io/ipfs/${(user.pfpCid as Uint8Array).toString()}`
      : "",
  };
};

export default async function getTxns(
  wallet: WalletContextState,
  connection: Connection,
  pks?: PublicKey[]
) {
  const program = await getProgram(wallet, connection);
  let res = [];

  if (!pks) res = await program.account.transaction.all();
  else {
    for (let pk of pks) {
      const outgoing = await program.account.transaction.all([
        {
          memcmp: {
            offset: 8, // Discriminator.
            bytes: pk.toBase58(),
          },
        },
      ]);
      res.push(...outgoing);

      const incoming = await program.account.transaction.all([
        {
          memcmp: {
            offset:
              8 + // Discriminator.
              32, // Payer public key.
            bytes: pk.toBase58(),
          },
        },
      ]);
      res.push(...incoming);
    }
  }

  const txnAccounts = res.sort(
    (a, b) => (b.account.time as number) - (a.account.time as number)
  );
  return await Promise.all(
    txnAccounts.map(async (txn) => {
      return {
        payer: await pubkeyToUser(
          txn.account.payer as PublicKey,
          true,
          wallet,
          connection
        ),
        payee: await pubkeyToUser(
          txn.account.payee as PublicKey,
          false,
          wallet,
          connection
        ),
        amount: (txn.account.amount as number) / 1000000000, // 1 billion lamports in 1 SOL
        time: dayjs.unix(txn.account.time as number).fromNow(),
        content: txn.account.content as string,
      };
    })
  );
}
