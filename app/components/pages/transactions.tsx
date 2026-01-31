import { useEffect, useState } from "react";
import { getTransactions, NETWORKS } from "../../lib/wallet";
import { ethers } from "ethers";


interface Wallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

interface Tx {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export default function Transactions() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [network, setNetwork] = useState<keyof typeof NETWORKS>("sepolia");
  const [txs, setTxs] = useState<Tx[]>([]);

    useEffect(() => {
  const w = localStorage.getItem("wallet");
  if (w) {
    setTimeout(() => setWallet(JSON.parse(w)), 0);
  }
}, []);

  useEffect(() => {
    if (!wallet) return;
    getTransactions(wallet.address, network).then(setTxs);
  }, [wallet, network]);

  if (!wallet) return <p>Loading wallet...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Transaction History</h1>

      <select
        className="bg-gray-800 text-white px-3 py-1 rounded"
        value={network}
        onChange={(e) => setNetwork(e.target.value as keyof typeof NETWORKS)}
      >
        {Object.keys(NETWORKS).map((n) => (
          <option key={n} value={n}>{NETWORKS[n as keyof typeof NETWORKS].name}</option>
        ))}
      </select>

      {txs.length === 0 && <p>No recent transactions</p>}

      {txs.map((tx) => (
        <div key={tx.hash} className="p-2 border rounded border-gray-700 flex flex-col gap-1">
          <p><strong>Hash:</strong> {tx.hash}</p>
          <p><strong>From:</strong> {tx.from}</p>
          <p><strong>To:</strong> {tx.to}</p>
          <p><strong>Value:</strong> {ethers.formatEther(tx.value)} ETH</p>
          <p><strong>Status:</strong> {tx.isError === "0" ? "Success" : "Failed"}</p>
        </div>
      ))}
    </div>
  );
}
