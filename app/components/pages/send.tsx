import { useState, useEffect } from "react";
import { sendTransaction, NETWORKS } from "../../lib/wallet";
import { useRouter } from "next/router";

interface Wallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export default function Send() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<keyof typeof NETWORKS>("sepolia");
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

  useEffect(() => {
  const w = localStorage.getItem("wallet");
  if (w) {
    setTimeout(() => setWallet(JSON.parse(w)), 0);
  }
}, []);

  const handleSend = async () => {
    if (!wallet) return;
    try {
      const hash = await sendTransaction(wallet.privateKey, to, amount, network);
      setTxHash(hash);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      alert(message);
    }
  };

  if (!wallet) return <p>Loading wallet...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Send ETH</h1>

      <select
        className="bg-gray-800 text-white px-3 py-1 rounded"
        value={network}
        onChange={(e) => setNetwork(e.target.value as keyof typeof NETWORKS)}
      >
        {Object.keys(NETWORKS).map((n) => (
          <option key={n} value={n}>{NETWORKS[n as keyof typeof NETWORKS].name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Recipient Address"
        className="p-2 rounded bg-gray-800 text-white"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        className="p-2 rounded bg-gray-800 text-white"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Send
      </button>

      {txHash && (
        <p className="text-green-400">Transaction sent! Hash: {txHash}</p>
      )}

      <button
        className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
