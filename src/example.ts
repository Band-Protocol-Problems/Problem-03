import TransactionClient from "./TransactionClient";

const client = new TransactionClient(
  "https://mock-node-wgqbnxruha-as.a.run.app"
);

async function example() {
  const payload = {
    symbol: "ETH",
    price: 4500,
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    const txHash = await client.broadcastTransaction(payload);
    console.log(`Transaction broadcasted with hash: ${txHash}`);

    const finalStatus = await client.monitorTransaction(
      txHash,
      5000,
      15,
      (status: string) => console.log(`Transaction status: ${status}`)
    );
    console.log(`Final transaction status: ${finalStatus}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred while broadcasting transaction");
    }
  }
}

example();
