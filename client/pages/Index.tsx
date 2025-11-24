import { useState } from "react";
import GradientBackground from "@/components/GradientBackground";
import Particles from "@/components/Particles";

interface BridgeTransaction {
  id: string;
  amount: string;
  hash: string;
  type: "deposit" | "withdraw";
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("withdraw");
  const [showRecentBridges, setShowRecentBridges] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [withdrawalHash, setWithdrawalHash] = useState<string | null>(null);
  
  // Sample recent bridge transactions (in a real app, this would come from an API)
  const recentBridges: BridgeTransaction[] = [
    {
      id: "0xabc123...def456",
      amount: "12.5 ZEC",
      hash: "0x1234567890abcdef1234567890abcdef12345678",
      type: "deposit",
    },
    {
      id: "0x789xyz...ghi789",
      amount: "8.2 ZEC",
      hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      type: "withdraw",
    },
    {
      id: "0x456def...jkl012",
      amount: "25.0 ZEC",
      hash: "0xfedcba0987654321fedcba0987654321fedcba09",
      type: "deposit",
    },
  ];

  return (
    <div className="min-h-screen bg-zolana-dark relative">
      <Particles />
      {/* Header */}
      <header className="px-4 sm:px-8 relative z-10" style={{ padding: "12px 16px 0" }}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center hover:scale-102 transition-transform">
            <svg
              className="h-7 sm:h-10"
              width="153"
              height="37"
              viewBox="0 0 153 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37 0V9.25H0L11.5625 0H37Z" fill="#F4BB2B" />
              <path d="M37 27.75L25.4375 37H0V27.75H37Z" fill="#F4BB2B" />
              <path d="M37 12.3332H15.4168L0 24.6668H21.5832L37 12.3332Z" fill="#F4BB2B" />
              <path d="M63.7447 26.5H48.7168V23.1842L57.9154 12.4615V12.1941H49.2249V8.5842H63.3704V11.9L54.0916 22.6227V22.8901H63.7447V26.5ZM79.2343 24.2806C77.7012 25.9385 75.6066 26.7674 72.9504 26.7674C70.2942 26.7674 68.1907 25.9385 66.6397 24.2806C65.1067 22.6049 64.3401 20.3587 64.3401 17.5421C64.3401 14.7255 65.1067 12.4882 66.6397 10.8304C68.1907 9.15465 70.2942 8.3168 72.9504 8.3168C75.6066 8.3168 77.7012 9.15465 79.2343 10.8304C80.7674 12.4882 81.5339 14.7255 81.5339 17.5421C81.5339 20.3587 80.7674 22.6049 79.2343 24.2806ZM69.5811 21.767C70.2407 22.5157 71.3638 22.8901 72.9504 22.8901C74.537 22.8901 75.6511 22.5157 76.2929 21.767C76.9346 21.0005 77.2555 19.5922 77.2555 17.5421C77.2555 15.492 76.9346 14.0926 76.2929 13.3439C75.6511 12.5774 74.537 12.1941 72.9504 12.1941C71.3638 12.1941 70.2407 12.5774 69.5811 13.3439C68.9394 14.0926 68.6185 15.492 68.6185 17.5421C68.6185 19.5922 68.9394 21.0005 69.5811 21.767ZM96.7275 26.5H83.4644V8.5842H87.4754V22.8901H96.7275V26.5ZM101.395 26.5H97.224L103.829 8.5842H109.658L116.263 26.5H111.904L110.46 22.5157H102.866L101.395 26.5ZM105.193 16.1516L104.176 18.9326H109.15L108.134 16.1516L106.824 12.1139H106.556L105.193 16.1516ZM121.109 26.5H117.098V8.5842H121.377L127.179 17.5688L128.677 19.9754H128.944L128.891 17.5688V8.5842H132.902V26.5H128.623L123.061 18.0234L121.323 15.2692H121.056L121.109 18.0234V26.5ZM137.902 26.5H133.73L140.335 8.5842H146.165L152.769 26.5H148.411L146.967 22.5157H139.373L137.902 26.5ZM141.699 16.1516L140.683 18.9326H145.656L144.64 16.1516L143.33 12.1139H143.063L141.699 16.1516Z" fill="white" />
            </svg>
          </div>
          <button className="bg-zolana-yellow text-black font-clash font-medium text-xs sm:text-[14px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-[#f5c547] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zolana-dark">
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 relative z-10" style={{ padding: "60px 16px 64px" }}>
        <div className="max-w-md mx-auto">
          <div className="bg-zolana-card rounded-lg border border-white/5 shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h2 className="text-white font-clash font-semibold text-xl sm:text-[25px]">
                  Bridge ZEC
                </h2>
                <p className="text-white/60 font-clash text-xs sm:text-sm">
                  Convert between ZEC and wrapped ZEC
                </p>
              </div>

              {/* Tab Buttons */}
              <div className="flex items-center gap-2 p-1 bg-zolana-section rounded-md">
                <button
                  onClick={() => setActiveTab("deposit")}
                  className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-clash font-medium text-xs sm:text-[13px] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zolana-yellow ${
                    activeTab === "deposit"
                      ? "bg-white text-black shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Deposit ZEC
                </button>
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-clash font-medium text-xs sm:text-[13px] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zolana-yellow ${
                    activeTab === "withdraw"
                      ? "bg-zolana-yellow text-black shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Withdraw wZEC
                </button>
              </div>

              {/* Deposit Tab */}
              {activeTab === "deposit" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Step 1 */}
                  <div className="bg-zolana-section border border-white/5 rounded-md p-4 hover:border-white/10 transition-colors">
                    <div className="space-y-2.5">
                      <h3 className="text-white font-clash font-medium text-xs sm:text-[13px]">
                        Send ZEC
                      </h3>
                      <div className="space-y-3">
                        <p className="text-white/70 font-clash font-normal text-[14px]">
                          Deposit address
                        </p>
                        <input
                          type="text"
                          value={depositAddress}
                          onChange={(e) => setDepositAddress(e.target.value)}
                          className="w-full bg-zolana-input border border-white/5 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 font-clash font-normal text-[14px] focus:outline-none focus:border-zolana-yellow transition-colors"
                          placeholder="t1YourZcashAddressHere..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-zolana-section border border-white/5 rounded-md p-4 hover:border-white/10 transition-colors">
                    <div className="space-y-2.5">
                      <h3 className="text-white font-clash font-medium text-xs sm:text-[13px]">
                        Confirm Transaction
                      </h3>
                      <div className="space-y-3">
                        <p className="text-white/70 font-clash font-normal text-[14px]">
                          After sending ZEC, paste your Zcash Transaction ID
                        </p>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Zcash Transaction ID (e.g. abc123...)"
                          className="w-full bg-zolana-input border border-white/5 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 font-clash font-normal text-[14px] focus:outline-none focus:border-zolana-yellow transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <button
                    disabled={!transactionId}
                    className="w-full bg-zolana-yellow text-black font-clash font-medium text-xs sm:text-[13px] py-3 px-4 rounded-md hover:bg-[#f5c547] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zolana-card"
                  >
                    Confirm Deposit
                  </button>
                </div>
              )}

              {/* Withdraw Tab */}
              {activeTab === "withdraw" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {!withdrawalHash ? (
                    <>
                      {/* Amount Input */}
                      <div className="bg-zolana-section border border-white/5 rounded-md p-4 hover:border-white/10 transition-colors">
                        <div className="space-y-3">
                          <label className="text-white font-clash font-medium text-xs sm:text-[13px]">
                            Amount
                          </label>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-zolana-input border border-white/5 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 font-clash font-normal text-[14px] focus:outline-none focus:border-zolana-yellow transition-colors"
                          />
                        </div>
                      </div>

                      {/* Recipient Address Input */}
                      <div className="bg-zolana-section border border-white/5 rounded-md p-4 hover:border-white/10 transition-colors">
                        <div className="space-y-3">
                          <label className="text-white font-clash font-medium text-xs sm:text-[13px]">
                            Recipient Address
                          </label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            placeholder="Enter wallet address"
                            className="w-full bg-zolana-input border border-white/5 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 font-clash font-normal text-[14px] focus:outline-none focus:border-zolana-yellow transition-colors"
                          />
                        </div>
                      </div>

                      {/* Estimation */}
                      {withdrawAmount && (
                        <div className="bg-zolana-section border border-white/5 rounded-md p-4">
                          <div className="space-y-2">
                            <p className="text-white/70 font-clash font-normal text-[14px]">
                              Estimated Withdrawal Time
                            </p>
                            <p className="text-white font-clash font-semibold text-lg sm:text-[24px]">
                              ~5-10 minutes
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Confirm Button */}
                      <button
                        onClick={() => setWithdrawalHash(`0x${Math.random().toString(16).slice(2, 10)}`)}
                        disabled={!withdrawAmount || !recipientAddress}
                        className="w-full bg-zolana-yellow text-black font-clash font-medium text-xs sm:text-[13px] py-3 px-4 rounded-md hover:bg-[#f5c547] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zolana-card"
                      >
                        Confirm Withdrawal
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Success State */}
                      <div className="bg-zolana-section border border-white/5 rounded-md p-4">
                        <div className="space-y-3 text-center">
                          <p className="text-white/70 font-clash font-normal text-[14px]">
                            Withdrawal Submitted
                          </p>
                          <p className="text-zolana-yellow font-clash font-semibold text-base sm:text-[20px]">
                            ✓ Success
                          </p>
                        </div>
                      </div>

                      {/* Transaction ID */}
                      <div className="bg-zolana-section border border-white/5 rounded-md p-4">
                        <div className="space-y-2">
                          <p className="text-white/70 font-clash font-normal text-[14px]">
                            Transaction ID
                          </p>
                          <div className="bg-zolana-input border border-white/5 rounded-md px-3 py-2.5">
                            <p className="text-white font-clash font-normal text-[13px] break-all">
                              {withdrawalHash}
                            </p>
                          </div>
                          <a
                            href={`https://explorer.zecdev.zcash.com/transaction/${withdrawalHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-zolana-yellow font-clash font-normal text-[13px] hover:underline mt-2"
                          >
                            View on Block Explorer →
                          </a>
                        </div>
                      </div>

                      {/* Reset Button */}
                      <button
                        onClick={() => {
                          setWithdrawalHash(null);
                          setWithdrawAmount("");
                          setRecipientAddress("");
                        }}
                        className="w-full bg-zolana-section text-white border border-white/5 font-clash font-medium text-xs sm:text-[13px] py-3 px-4 rounded-md hover:bg-zolana-section hover:border-white/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zolana-card"
                      >
                        New Withdrawal
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Recent Bridges Section */}
        <div className="mt-4 max-w-md mx-auto">
          <button
            onClick={() => setShowRecentBridges(!showRecentBridges)}
            className="w-full bg-zolana-card text-white border border-white/5 font-clash font-medium text-xs sm:text-[13px] py-2.5 px-4 rounded-md hover:bg-white/5 hover:border-white/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zolana-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-zolana-dark"
          >
            {showRecentBridges ? "Hide" : "Recent Bridges"}
          </button>

          {showRecentBridges && (
            <div className="mt-4 bg-zolana-card rounded-lg border border-white/5 shadow-lg p-4 sm:p-6 animate-in fade-in duration-200">
              <h3 className="text-white font-clash font-medium text-xs sm:text-[13px] mb-4">
                Recent Bridge Transactions
              </h3>
              <div className="space-y-3">
                {recentBridges.length > 0 ? (
                  recentBridges.map((transaction, index) => (
                    <div
                      key={index}
                      className="bg-zolana-section border border-white/5 rounded-md p-3 sm:p-4 hover:border-white/10 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 font-clash font-normal text-xs mb-1">
                              {transaction.type === "deposit" ? "Deposit" : "Withdraw"}
                            </p>
                            <p className="text-white font-clash font-semibold text-sm sm:text-base">
                              {transaction.amount}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-[10px] sm:text-xs font-clash font-medium ${
                              transaction.type === "deposit"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {transaction.type === "deposit" ? "IN" : "OUT"}
                          </span>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                          <div>
                            <p className="text-white/60 font-clash font-normal text-[11px] sm:text-xs mb-1">
                              Transaction ID
                            </p>
                            <p className="text-white/80 font-clash font-normal text-[11px] sm:text-xs break-all">
                              {transaction.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 font-clash font-normal text-[11px] sm:text-xs mb-1">
                              Hash
                            </p>
                            <a
                              href={`https://explorer.zecdev.zcash.com/transaction/${transaction.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zolana-yellow font-clash font-normal text-[11px] sm:text-xs hover:underline break-all block"
                            >
                              {transaction.hash.slice(0, 20)}...{transaction.hash.slice(-8)} →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 font-clash font-normal text-xs sm:text-sm text-center py-4">
                    No recent bridges found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Metrics Section */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-zolana-card rounded-lg border border-white/5 p-3 sm:p-4 text-center hover:border-white/10 transition-colors">
              <p className="text-white/60 font-clash font-normal text-xs sm:text-[14px] mb-1 sm:mb-2">
                Total Bridged
              </p>
              <p className="text-white font-clash font-semibold text-lg sm:text-[24px]">
                $2.4M
              </p>
            </div>
            <div className="bg-zolana-card rounded-lg border border-white/5 p-3 sm:p-4 text-center hover:border-white/10 transition-colors">
              <p className="text-white/60 font-clash font-normal text-xs sm:text-[14px] mb-1 sm:mb-2">
                Revenue
              </p>
              <p className="text-zolana-yellow font-clash font-semibold text-lg sm:text-[24px]">
                $45.2K
              </p>
            </div>
            <div className="bg-zolana-card rounded-lg border border-white/5 p-3 sm:p-4 text-center hover:border-white/10 transition-colors">
              <p className="text-white/60 font-clash font-normal text-xs sm:text-[14px] mb-1 sm:mb-2">
                Buybacks
              </p>
              <p className="text-white font-clash font-semibold text-lg sm:text-[24px]">
                $12.8K
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Gradient Background Section */}
      <GradientBackground
        numBars={7}
        gradientFrom="#F4BB2B"
        gradientTo="transparent"
        animationDuration={2}
        backgroundColor="#141414"
      />
    </div>
  );
}
