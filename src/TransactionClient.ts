type BroadcastPayload = {
  symbol: string;
  price: number;
  timestamp: number;
};

type BroadcastResponse = {
  tx_hash: string;
};

type CheckResponse = {
  tx_status: string;
};

type StatusCallback = (status: string) => void;

export default class TransactionClient {
  private baseURL: string;

  static readonly STATUS_CONFIRMED = "CONFIRMED";
  static readonly STATUS_FAILED = "FAILED";
  static readonly STATUS_PENDING = "PENDING";
  static readonly STATUS_DNE = "DNE";

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async broadcastTransaction(payload: BroadcastPayload): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: BroadcastResponse = await response.json();
      return data.tx_hash;
    } catch (error) {
      throw new Error(
        `Failed to broadcast transaction: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async checkTransactionStatus(txHash: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/check/${txHash}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CheckResponse = await response.json();
      return data.tx_status;
    } catch (error) {
      throw new Error(
        `Failed to check transaction status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async monitorTransaction(
    txHash: string,
    interval: number = 5000,
    maxRetries: number = 10,
    statusCallback?: StatusCallback
  ): Promise<string> {
    let retries = 0;

    while (true) {
      const status = await this.checkTransactionStatus(txHash);

      if (statusCallback) {
        statusCallback(status);
      }

      switch (status) {
        case TransactionClient.STATUS_CONFIRMED:
          return "Transaction confirmed";
        case TransactionClient.STATUS_FAILED:
          return "Transaction failed";
        case TransactionClient.STATUS_PENDING:
          if (retries >= maxRetries) {
            return "Transaction is still pending after maximum retries";
          }
          retries++;
          await new Promise((resolve) => setTimeout(resolve, interval));
          break;
        case TransactionClient.STATUS_DNE:
          return "Transaction does not exist";
        default:
          throw new Error(`Unknown transaction status: ${status}`);
      }
    }
  }
}
