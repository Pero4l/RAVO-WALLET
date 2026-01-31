import { useEffect, useState } from "react";
import { getBalance, NETWORKS } from "../../lib/wallet";
import Link from "next/link";

interface Wallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export default function Dashboard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState("0");
  const [network, setNetwork] = useState<keyof typeof NETWORKS>("sepolia");

 useEffect(() => {
  const w = localStorage.getItem("wallet");
  if (w) {
    setTimeout(() => setWallet(JSON.parse(w)), 0);
  }
}, []);


  useEffect(() => {
    if (wallet) getBalance(wallet.address, network).then(setBalance);
  }, [wallet, network]);

  if (!wallet) return <p>Loading wallet...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Ravo Dashboard</h1>

      <div className="flex justify-between items-center">
        <p><strong>Address:</strong> {wallet.address}</p>
        <select
          className="bg-gray-800 text-white px-3 py-1 rounded"
          value={network}
          onChange={(e) => setNetwork(e.target.value as keyof typeof NETWORKS)}
        >
          {Object.keys(NETWORKS).map((n) => (
            <option key={n} value={n}>{NETWORKS[n as keyof typeof NETWORKS].name}</option>
          ))}
        </select>
      </div>

      <p><strong>Balance:</strong> {balance} ETH</p>

      <div className="flex gap-4">
        <Link href="/send" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">Send</Link>
        <Link href="/receive" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">Receive</Link>
        <Link href="/transactions" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Transactions</Link>
      </div>
    </div>
  );
}
