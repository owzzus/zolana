import { RequestHandler } from "express";
import {
  GetCurrenciesResponse,
  GetQuoteRequest,
  GetQuoteResponse,
  InitiateBridgeRequest,
  InitiateBridgeResponse,
  GetTransactionStatusResponse,
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse,
  SupportedCurrency,
  BridgeQuote,
  BridgeTransaction,
  Currency,
  Chain,
  TransactionStatus,
} from "@shared/api";
import { z } from "zod";

// Validation Schemas
const GetQuoteSchema = z.object({
  fromCurrency: z.nativeEnum(Currency),
  fromChain: z.nativeEnum(Chain),
  toCurrency: z.nativeEnum(Currency),
  toChain: z.nativeEnum(Chain),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Invalid amount format"),
});

const InitiateBridgeSchema = z.object({
  fromCurrency: z.nativeEnum(Currency),
  fromChain: z.nativeEnum(Chain),
  toCurrency: z.nativeEnum(Currency),
  toChain: z.nativeEnum(Chain),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Invalid amount format"),
  fromAddress: z.string().min(1, "From address is required"),
  toAddress: z.string().min(1, "To address is required"),
  quoteId: z.string().min(1, "Quote ID is required"),
});

// In-memory storage (replace with database in production)
const transactions = new Map<string, BridgeTransaction>();
const quotes = new Map<string, BridgeQuote>();

// Supported currencies configuration
const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  {
    symbol: Currency.ETH,
    name: "Ethereum",
    chain: Chain.ETHEREUM,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: Currency.ETH,
    name: "Ethereum",
    chain: Chain.ARBITRUM,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: Currency.BNB,
    name: "Binance Coin",
    chain: Chain.BINANCE_SMART_CHAIN,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: Currency.MATIC,
    name: "Polygon",
    chain: Chain.POLYGON,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: Currency.AVAX,
    name: "Avalanche",
    chain: Chain.AVALANCHE,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: Currency.USDC,
    name: "USD Coin",
    chain: Chain.ETHEREUM,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    symbol: Currency.USDC,
    name: "USD Coin",
    chain: Chain.POLYGON,
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
  },
  {
    symbol: Currency.USDT,
    name: "Tether",
    chain: Chain.ETHEREUM,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  {
    symbol: Currency.SOL,
    name: "Solana",
    chain: Chain.SOLANA,
    address: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
];

/**
 * GET /api/bridge/currencies
 * Get list of supported currencies and chains
 */
export const handleGetCurrencies: RequestHandler = (req, res) => {
  try {
    const response: GetCurrenciesResponse = {
      currencies: SUPPORTED_CURRENCIES,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch currencies" });
  }
};

/**
 * GET /api/bridge/quote
 * Get a quote for bridging between currencies/chains
 * Query params: fromCurrency, fromChain, toCurrency, toChain, amount
 */
export const handleGetQuote: RequestHandler = (req, res) => {
  try {
    const query = GetQuoteSchema.parse({
      fromCurrency: req.query.fromCurrency,
      fromChain: req.query.fromChain,
      toCurrency: req.query.toCurrency,
      toChain: req.query.toChain,
      amount: req.query.amount,
    });

    const amount = parseFloat(query.amount);

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Check if currencies are supported on specified chains
    const fromCurrencyData = SUPPORTED_CURRENCIES.find(
      (c) => c.symbol === query.fromCurrency && c.chain === query.fromChain
    );
    const toCurrencyData = SUPPORTED_CURRENCIES.find(
      (c) => c.symbol === query.toCurrency && c.chain === query.toChain
    );

    if (!fromCurrencyData || !toCurrencyData) {
      return res
        .status(400)
        .json({ error: "Currency/chain combination not supported" });
    }

    if (
      query.fromCurrency === query.toCurrency &&
      query.fromChain === query.toChain
    ) {
      return res
        .status(400)
        .json({ error: "Source and destination must be different" });
    }

    // Calculate bridge quote (simplified calculation)
    // In production, this would call actual bridge protocols/liquidity pools
    const bridgeFeePercentage = 0.003; // 0.3% bridge fee
    const fee = amount * bridgeFeePercentage;
    const estimatedOutput = amount - fee;

    // Simulate exchange rate (1:1 for same currency, different chains)
    const exchangeRate = "1.0";

    const quote: BridgeQuote = {
      fromCurrency: query.fromCurrency,
      fromChain: query.fromChain,
      toCurrency: query.toCurrency,
      toChain: query.toChain,
      amount: amount.toString(),
      estimatedOutput: estimatedOutput.toFixed(6),
      fee: fee.toFixed(6),
      feePercentage: bridgeFeePercentage * 100,
      estimatedTimeMinutes: 5, // Typical bridge time
      exchangeRate,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes expiry
    };

    // Store quote with unique ID
    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    quotes.set(quoteId, quote);

    const response: GetQuoteResponse & { quoteId: string } = {
      quote,
      quoteId,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request parameters",
        details: error.errors,
      });
    }
    res.status(500).json({ error: "Failed to generate quote" });
  }
};

/**
 * POST /api/bridge/initiate
 * Initiate a bridge transaction
 */
export const handleInitiateBridge: RequestHandler = (req, res) => {
  try {
    const body = InitiateBridgeSchema.parse(req.body);

    // Validate quote exists and is not expired
    const quote = quotes.get(body.quoteId);
    if (!quote) {
      return res.status(404).json({ error: "Quote not found or expired" });
    }

    const quoteExpiry = new Date(quote.expiresAt);
    if (quoteExpiry < new Date()) {
      return res.status(400).json({ error: "Quote has expired" });
    }

    // Validate quote matches request
    if (
      quote.fromCurrency !== body.fromCurrency ||
      quote.fromChain !== body.fromChain ||
      quote.toCurrency !== body.toCurrency ||
      quote.toChain !== body.toChain ||
      quote.amount !== body.amount
    ) {
      return res.status(400).json({ error: "Quote does not match request" });
    }

    // Create transaction
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const transaction: BridgeTransaction = {
      id: transactionId,
      fromCurrency: body.fromCurrency,
      fromChain: body.fromChain,
      toCurrency: body.toCurrency,
      toChain: body.toChain,
      amount: body.amount,
      estimatedOutput: quote.estimatedOutput,
      fee: quote.fee,
      fromAddress: body.fromAddress,
      toAddress: body.toAddress,
      status: TransactionStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    transactions.set(transactionId, transaction);

    // Simulate transaction processing (in production, this would interact with blockchain)
    // For now, we'll mark it as processing after a short delay
    setTimeout(() => {
      const tx = transactions.get(transactionId);
      if (tx) {
        tx.status = TransactionStatus.PROCESSING;
        transactions.set(transactionId, tx);
      }
    }, 1000);

    const response: InitiateBridgeResponse = {
      transaction,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.errors,
      });
    }
    res.status(500).json({ error: "Failed to initiate bridge transaction" });
  }
};

/**
 * GET /api/bridge/status/:id
 * Get status of a bridge transaction
 */
export const handleGetTransactionStatus: RequestHandler = (req, res) => {
  try {
    const transactionId = req.params.id;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const transaction = transactions.get(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Simulate transaction progress (in production, check blockchain)
    // Update status based on time elapsed
    const createdAt = new Date(transaction.createdAt);
    const timeElapsed = Date.now() - createdAt.getTime();
    const minutesElapsed = timeElapsed / (1000 * 60);

    if (
      transaction.status === TransactionStatus.PROCESSING &&
      minutesElapsed > 2
    ) {
      transaction.status = TransactionStatus.CONFIRMING;
      transactions.set(transactionId, transaction);
    }

    if (
      transaction.status === TransactionStatus.CONFIRMING &&
      minutesElapsed > 4
    ) {
      transaction.status = TransactionStatus.COMPLETED;
      transaction.completedAt = new Date().toISOString();
      transaction.txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      transaction.destinationTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      transactions.set(transactionId, transaction);
    }

    const response: GetTransactionStatusResponse = {
      transaction,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction status" });
  }
};

/**
 * GET /api/bridge/history
 * Get transaction history with optional filters
 * Query params: address, status, limit, offset
 */
export const handleGetTransactionHistory: RequestHandler = (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const address = req.query.address as string | undefined;
    const status = req.query.status as TransactionStatus | undefined;

    // Validate status if provided
    if (status && !Object.values(TransactionStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Filter transactions
    let filteredTransactions = Array.from(transactions.values());

    if (address) {
      filteredTransactions = filteredTransactions.filter(
        (tx) => tx.fromAddress === address || tx.toAddress === address
      );
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(
        (tx) => tx.status === status
      );
    }

    // Sort by creation date (newest first)
    filteredTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const total = filteredTransactions.length;
    const paginatedTransactions = filteredTransactions.slice(
      offset,
      offset + limit
    );

    const response: GetTransactionHistoryResponse = {
      transactions: paginatedTransactions,
      total,
      limit,
      offset,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction history" });
  }
};

