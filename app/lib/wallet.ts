import { ethers } from "ethers";
import * as bip39 from "bip39";

export const NETWORKS = {
  sepolia: {
    name: "Sepolia",
    rpc: "https://eth-sepolia.g.alchemy.com/v2/YOUR_SEPOLIA_KEY",
    chainId: 11155111,
  },
  mainnet: {
    name: "Ethereum Mainnet",
    rpc: "https://eth-mainnet.g.alchemy.com/v2/YOUR_MAINNET_KEY",
    chainId: 1,
  },
};

// Create new wallet
export async function createWallet() {
  const mnemonic = bip39.generateMnemonic();
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  return {
    mnemonic,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Import wallet
export async function importWallet(mnemonic: string) {
  if (!bip39.validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  return {
    mnemonic,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Get provider by network
export function getProvider(network: keyof typeof NETWORKS) {
  return new ethers.JsonRpcProvider(NETWORKS[network].rpc);
}

// Get balance
export async function getBalance(address: string, network: keyof typeof NETWORKS) {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Send ETH
export async function sendTransaction(
  privateKey: string,
  to: string,
  amount: string,
  network: keyof typeof NETWORKS
) {
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
}

// Get transaction history (via Etherscan API)
export async function getTransactions(address: string, network: keyof typeof NETWORKS) {
  const apiKey = network === "sepolia" ? "YOUR_SEPOLIA_ETHERSCAN_KEY" : "YOUR_MAINNET_ETHERSCAN_KEY";
  const url = `https://api-${network === "sepolia" ? "sepolia" : "api"}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "1") return [];
  return data.result;
}
