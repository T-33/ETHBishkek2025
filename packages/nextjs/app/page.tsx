"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 bg-[#0D1117] min-h-screen">
        <div className="px-5 max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Game Economy Dashboard
            </h1>
            <p className="text-xl text-gray-400 mb-6">Transparent blockchain-based game economy analytics platform</p>
            <div className="flex justify-center items-center space-x-2 flex-col mb-4">
              <p className="my-2 font-medium text-gray-300">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-12 border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Solution</h2>
            <p className="text-gray-300 mb-4">
              Game economies are often opaque and difficult to manage. Developers struggle to understand:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>How quickly in-game currency circulates</li>
              <li>How much currency accumulates with players</li>
              <li>Impact of price changes and drop rates on the economy</li>
            </ul>
            <p className="text-gray-300">
              Our platform provides <strong className="text-blue-400">real-time blockchain-based analytics</strong> for
              transparent game economy management using Ethereum smart contracts.
            </p>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Player Portal */}
            <Link href="/player">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 shadow-2xl border-2 border-purple-500">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-3xl font-bold text-white mb-3">Player Portal</h3>
                <p className="text-purple-100 mb-6">Open mystery lootboxes, collect items, and build your inventory</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-purple-100">Features:</p>
                  <ul className="text-sm text-white space-y-1 mt-2">
                    <li>✨ Open NFT lootboxes</li>
                    <li>🎁 Collect unique items</li>
                    <li>📦 View your inventory</li>
                    <li>🔥 Burn unwanted tokens</li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Transaction History */}
            <Link href="/history">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-8 text-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 shadow-2xl border-2 border-cyan-500">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-3xl font-bold text-white mb-3">Your History</h3>
                <p className="text-cyan-100 mb-6">View all your transactions and activity on the blockchain</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-cyan-100">Track:</p>
                  <ul className="text-sm text-white space-y-1 mt-2">
                    <li>📥 Items received</li>
                    <li>📤 Items sent</li>
                    <li>🔥 Items burned</li>
                    <li>🎁 Lootboxes opened</li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Developer Analytics */}
            <Link href="/analytics">
              <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 text-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 shadow-2xl border-2 border-green-500">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-3xl font-bold text-white mb-3">Developer Analytics</h3>
                <p className="text-green-100 mb-6">Real-time economy insights and blockchain-based analytics</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-green-100">Track:</p>
                  <ul className="text-sm text-white space-y-1 mt-2">
                    <li>📈 Total minted & burned tokens</li>
                    <li>💎 Tokens in circulation</li>
                    <li>👥 Player distribution</li>
                    <li>💰 Money flow & revenue</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">⚡ Built With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">⚙️</p>
                <p className="text-white font-semibold">Ethereum</p>
                <p className="text-xs text-gray-400">Smart Contracts</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">🎨</p>
                <p className="text-white font-semibold">Next.js</p>
                <p className="text-xs text-gray-400">Frontend</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">🔗</p>
                <p className="text-white font-semibold">ERC1155</p>
                <p className="text-xs text-gray-400">NFT Standard</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">📡</p>
                <p className="text-white font-semibold">Wagmi</p>
                <p className="text-xs text-gray-400">Web3 Hooks</p>
              </div>
            </div>
          </div>

          {/* Developer Tools */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Developer Tools:</p>
            <div className="flex justify-center gap-4">
              <Link href="/debug" className="text-blue-400 hover:text-blue-300 underline">
                Debug Contracts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
