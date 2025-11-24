import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetCurrencies,
  handleGetQuote,
  handleInitiateBridge,
  handleGetTransactionStatus,
  handleGetTransactionHistory,
} from "./routes/bridge";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check and example routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Bridge API routes
  app.get("/api/bridge/currencies", handleGetCurrencies);
  app.get("/api/bridge/quote", handleGetQuote);
  app.post("/api/bridge/initiate", handleInitiateBridge);
  app.get("/api/bridge/status/:id", handleGetTransactionStatus);
  app.get("/api/bridge/history", handleGetTransactionHistory);

  return app;
}
