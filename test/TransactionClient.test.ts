import TransactionClient from "../src/TransactionClient";

global.fetch = jest.fn();

describe("TransactionClient Tests", () => {
  const baseURL = "https://mock-node-wgqbnxruha-as.a.run.app";
  let client: TransactionClient;

  beforeEach(() => {
    client = new TransactionClient(baseURL);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should broadcast transaction and return tx_hash", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tx_hash: "test_hash" }),
    });

    const payload = {
      symbol: "ETH",
      price: 1000,
      timestamp: Math.floor(Date.now() / 1000),
    };

    const txHash = await client.broadcastTransaction(payload);

    expect(txHash).toBe("test_hash");
    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  });

  it("should handle broadcast transaction errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const payload = {
      symbol: "ETH",
      price: 1000,
      timestamp: Math.floor(Date.now() / 1000),
    };

    await expect(client.broadcastTransaction(payload)).rejects.toThrow(
      "Failed to broadcast transaction: HTTP error! Status: 500"
    );
  });

  it("should check transaction status and return status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tx_status: TransactionClient.STATUS_CONFIRMED }),
    });

    const txHash = "test_hash";
    const status = await client.checkTransactionStatus(txHash);

    expect(status).toBe(TransactionClient.STATUS_CONFIRMED);
    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/check/${txHash}`, {
      method: "GET",
    });
  });

  it("should handle check transaction status errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const txHash = "test_hash";

    await expect(client.checkTransactionStatus(txHash)).rejects.toThrow(
      "Failed to check transaction status: HTTP error! Status: 404"
    );
  });

  it("should monitor transaction status", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tx_status: TransactionClient.STATUS_PENDING }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tx_status: TransactionClient.STATUS_CONFIRMED }),
      });

    const txHash = "test_hash";
    const finalStatus = await client.monitorTransaction(txHash, 100, 2);

    expect(finalStatus).toBe("Transaction confirmed");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
