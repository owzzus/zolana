/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Crypto Bridge API Types
 */

export enum Chain {
  ETHEREUM = "ethereum",
  BINANCE_SMART_CHAIN = "bsc",
  POLYGON = "polygon",
  AVALANCHE = "avalanche",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
  SOLANA = "solana",
}

export enum Currency {
  ETH = "ETH",
  BNB = "BNB",
  MATIC = "MATIC",
  AVAX = "AVAX",
  USDC = "USDC",
  USDT = "USDT",
  DAI = "DAI",
  SOL = "SOL",
}

export interface SupportedCurrency {
  symbol: Currency;
  name: string;
  chain: Chain;
  address: string;
  decimals: number;
  logoUrl?: string;
}

export interface BridgeQuote {
  fromCurrency: Currency;
  fromChain: Chain;
  toCurrency: Currency;
  toChain: Chain;
  amount: string;
  estimatedOutput: string;
  fee: string;
  feePercentage: number;
  estimatedTimeMinutes: number;
  exchangeRate: string;
  expiresAt: string; // ISO timestamp
}

export interface BridgeTransaction {
  id: string;
  fromCurrency: Currency;
  fromChain: Chain;
  toCurrency: Currency;
  toChain: Chain;
  amount: string;
  estimatedOutput: string;
  fee: string;
  fromAddress: string;
  toAddress: string;
  status: TransactionStatus;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  txHash?: string;
  destinationTxHash?: string;
  errorMessage?: string;
}

export enum TransactionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CONFIRMING = "confirming",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// Request/Response Types

export interface GetCurrenciesResponse {
  currencies: SupportedCurrency[];
}

export interface GetQuoteRequest {
  fromCurrency: Currency;
  fromChain: Chain;
  toCurrency: Currency;
  toChain: Chain;
  amount: string;
}

export interface GetQuoteResponse {
  quote: BridgeQuote;
}

export interface InitiateBridgeRequest {
  fromCurrency: Currency;
  fromChain: Chain;
  toCurrency: Currency;
  toChain: Chain;
  amount: string;
  fromAddress: string;
  toAddress: string;
  quoteId: string; // Reference to the quote
}

export interface InitiateBridgeResponse {
  transaction: BridgeTransaction;
}

export interface GetTransactionStatusResponse {
  transaction: BridgeTransaction;
}

export interface GetTransactionHistoryRequest {
  address?: string;
  status?: TransactionStatus;
  limit?: number;
  offset?: number;
}

export interface GetTransactionHistoryResponse {
  transactions: BridgeTransaction[];
  total: number;
  limit: number;
  offset: number;
}
