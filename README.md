# TransactionClient

## Overview

`TransactionClient` is a TypeScript module designed for broadcasting and monitoring transactions. This client interacts with a HTTP server to broadcast transactions and subsequently monitor their status until finalization. It provides methods to send a transaction request and check its status periodically.

## Features

- **Broadcast Transaction**: Sends a transaction payload to a server and retrieves a transaction hash.
- **Monitor Transaction**: Periodically checks the status of a transaction until it is confirmed, fails, or reaches a maximum number of retries.
- **Flexible Configuration**: Customize polling intervals and retry limits.

## Installation

To use the `TransactionClient` module, follow these steps to set it up in your project.

### 1. Prerequisites

Ensure you have the following prerequisites installed:

- **Node.js**: Version 14 or higher.
- **npm** or [yarn](https://classic.yarnpkg.com/) as an alternative.

### 2. Installation Steps

#### 2.1. **Clone the Repository**

If you haven't already, clone the repository to your local machine:

```bash
git clone https://github.com/Band-Protocol-Problems/Problem-03.git

cd Problem-03
```

#### 2.2. **Install Dependencies**

Navigate to the project directory and install the dependencies using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

This will install all the necessary dependencies, including TypeScript and testing libraries.

## Usage

### Importing the Module

```typescript
import TransactionClient from "./TransactionClient";
```

### Creating an Instance

Create an instance of `TransactionClient` by specifying the base URL for the HTTP server.

```typescript
const client = new TransactionClient(
  "https://mock-node-wgqbnxruha-as.a.run.app"
);
```

### Broadcasting a Transaction

Use the `broadcastTransaction` method to send a transaction payload and obtain a transaction hash.

```typescript
const payload = {
  symbol: "ETH",
  price: 4500,
  timestamp: Math.floor(Date.now() / 1000),
};

try {
  const txHash = await client.broadcastTransaction(payload);
  console.log(`Transaction broadcasted with hash: ${txHash}`);
} catch (error) {
  console.error(`Error broadcasting transaction: ${error.message}`);
}
```

### Monitoring a Transaction

Use the `monitorTransaction` method to periodically check the status of a transaction until it is confirmed or the maximum number of retries is reached.

```typescript
const txHash = "your_tx_hash_here";

try {
  const finalStatus = await client.monitorTransaction(
    txHash,
    5000, // polling interval in milliseconds
    15, // maximum retries
    (status: string) => console.log(`Transaction status: ${status}`)
  );
  console.log(`Final transaction status: ${finalStatus}`);
} catch (error) {
  console.error(`Error monitoring transaction: ${error.message}`);
}
```

## Documentation

### Methods

#### `broadcastTransaction(payload: BroadcastPayload): Promise<string>`

- **Description**: Sends a POST request to broadcast a transaction.
- **Parameters**:
  - `payload`: An object containing `symbol`, `price`, and `timestamp`.
- **Returns**: A promise that resolves to the transaction hash.

#### `checkTransactionStatus(txHash: string): Promise<string>`

- **Description**: Sends a GET request to check the status of a transaction.
- **Parameters**:
  - `txHash`: The transaction hash obtained from the broadcast response.
- **Returns**: A promise that resolves to the transaction status.

#### `monitorTransaction(txHash: string, interval?: number, maxRetries?: number, statusCallback?: StatusCallback): Promise<string>`

- **Description**: Periodically checks the status of a transaction until it is confirmed or the maximum number of retries is reached.
- **Parameters**:
  - `txHash`: The transaction hash to monitor.
  - `interval` (optional): The polling interval in milliseconds (default: 5000).
  - `maxRetries` (optional): The maximum number of retries (default: 10).
  - `statusCallback` (optional): A callback function that is called with the current status.
- **Returns**: A promise that resolves to the final transaction status.

### Status Constants

- `TransactionClient.STATUS_CONFIRMED`: Indicates that the transaction has been processed and confirmed.
- `TransactionClient.STATUS_FAILED`: Indicates that the transaction failed to process.
- `TransactionClient.STATUS_PENDING`: Indicates that the transaction is awaiting processing.
- `TransactionClient.STATUS_DNE`: Indicates that the transaction does not exist.

## Design Decisions, Trade-offs, and Assumptions

The `TransactionClient` module is designed to broadcast a transaction to a server and monitor its status until finalization. It involves interacting with HTTP endpoints for broadcasting and status checking, as well as implementing polling for monitoring.

### Design Decisions

1. **Architecture and Modularity**:

   - **Class-based Design**: Using a class (`TransactionClient`) allows for encapsulating related functionalities (broadcasting, checking, and monitoring transactions) into a single module, promoting code reuse and maintainability.
   - **Separation of Concerns**: Methods are designed to handle specific tasks:
     - `broadcastTransaction` for sending transaction data.
     - `checkTransactionStatus` for querying transaction status.
     - `monitorTransaction` for periodic status checking and retry logic.

2. **Polling and Monitoring**:

   - **Polling Interval**: A default interval of 5000 milliseconds (5 seconds) is used for status checks. This balances the need for timely updates with the potential load on the server.
   - **Max Retries**: The default maximum number of retries is set to 10. This allows sufficient attempts to monitor the transaction while avoiding excessive server requests.

3. **Callback Function**:
   - **StatusCallback**: An optional callback (`statusCallback`) allows users to receive updates on the transaction status in real-time, providing flexibility for different use cases.

### Trade-offs

1. **Polling Interval and Max Retries**:

   - **Trade-off**: Shorter polling intervals provide more timely updates but increase the load on both the client and server. Longer intervals reduce the load but may delay status updates.
   - **Solution**: A balanced default (5 seconds) and a configurable maximum number of retries (10) provide a good trade-off between responsiveness and resource usage.

### Assumptions

1. **Timestamp Unit**:

   - **Assumption**: The `timestamp` is assumed to be in seconds since the Unix epoch, consistent with standard blockchain practices.

2. **Server Behavior**:

   - **Assumption**: The server is assumed to return valid JSON responses and status codes as described. The module handles unexpected responses with generic error messages.
     ling behavior.

## Testing

The module includes tests using Jest. To run the tests, ensure you have Jest installed and run:

```bash
npm run test
```

The test suite covers:

- Broadcasting transactions and handling errors.
- Checking transaction status and handling errors.
- Monitoring transaction status with polling and retries.

## Running example.ts script

```bash
npm run example
```
