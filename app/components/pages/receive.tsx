import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

interface Wallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export default function Receive() {
  const [wallet, setWallet] = useState<Wallet | null>(null);

 useEffect(() => {
  const w = localStorage.getItem("wallet");
  if (w) {
    setTimeout(() => setWallet(JSON.parse(w)), 0);
  }
}, []);

  if (!wallet) return <p>Loading wallet...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Receive ETH</h1>
      <QRCode value={wallet.address} />
      <p className="font-mono break-all">{wallet.address}</p>
    </div>
  );
}
