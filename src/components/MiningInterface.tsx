import React, { useState } from 'react';
import { Pickaxe, Zap, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { apiRequest } from '../hooks/useApi';
import { MiningResult, NetworkStatus } from '../types';
import { useEffect } from 'react';




export const MiningInterface: React.FC = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    lastSync: new Date().toISOString(),
    blockHeight: 0,
    pendingCount: 0
  });

 const fetchPendingCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/chain');
      const data = await res.json();
      setNetworkStatus(prev => ({
        ...prev,
        pendingCount: data.pendingTransactions.length,
        blockHeight: data.chain.length,
        lastSync: new Date().toISOString()
      }));
    } catch (err) {
      console.error("⚠️ Error fetching chain:", err);
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false
      }));
    }
  };

  // ✅ INSIDE useEffect like a law-abiding citizen
  useEffect(() => {
    fetchPendingCount();
  }, []);

  const startMining = async () => {
    setIsMining(true);
    setMiningResult(null);

    try {
      const result = await apiRequest<MiningResult>('/api/mine', {
        method: 'POST'
      });

      setMiningResult(result);

      // 🔁 Refresh network state after mining
      await fetchPendingCount();

    } catch (error) {
      alert('🧨 Mining failed. Try again after yelling at your code.');
    } finally {
      setIsMining(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Mining Interface</h2>
        <p className="text-gray-400">Mine new blocks and secure the time capsule network</p>
      </div>

      {/* Network Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              networkStatus.isOnline ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Network Status</p>
              <p className={`text-lg font-bold ${
                networkStatus.isOnline ? 'text-green-500' : 'text-red-500'
              }`}>
                {networkStatus.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Block Height</p>
              <p className="text-2xl font-bold text-white">{networkStatus.blockHeight}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Transactions</p>
              <p className="text-2xl font-bold text-white">{networkStatus.pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Sync</p>
              <p className="text-sm font-bold text-white">
                {new Date(networkStatus.lastSync).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 mb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Pickaxe className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Mining Control</h3>
          <p className="text-gray-400 mb-6">
            {isMining 
              ? 'Mining in progress... This may take a few moments'
              : 'Click below to start mining a new block'
            }
          </p>
          
          <Button
            onClick={startMining}
            disabled={isMining || networkStatus.pendingCount === 0}
            loading={isMining}
            size="large"
            className="min-w-48"
            icon={<Pickaxe className="w-5 h-5" />}
          >
            {isMining ? 'Mining...' : 'Start Mining'}
          </Button>
          
          {networkStatus.pendingCount === 0 && !isMining && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">No pending transactions to mine</p>
            </div>
          )}
        </div>
      </div>

      {/* Mining Animation */}
      {isMining && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 mb-8">
          <div className="text-center">
            <div className="relative">
              <div className="animate-pulse w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-yellow-500/10 rounded-full animate-ping mx-auto"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mining Block...</h3>
            <p className="text-gray-400">Processing pending transactions and calculating proof of work</p>
            
            <div className="mt-6 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mining Result */}
      {miningResult && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mining Successful!</h3>
            <p className="text-gray-400 mb-6">New block has been mined and added to the blockchain</p>
            
            <div className="bg-gray-800/50 rounded-lg p-6 text-left">
              <h4 className="text-lg font-bold text-white mb-4">Block Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Block Index</p>
                  <p className="text-lg font-bold text-white">#{miningResult.block.index}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Execution Time</p>
                  <p className="text-lg font-bold text-white">{miningResult.executionTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nonce</p>
                  <p className="text-lg font-bold text-white">{miningResult.block.nonce}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Transactions</p>
                  <p className="text-lg font-bold text-white">{miningResult.block.data.length}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Block Hash</p>
                <p className="text-xs text-gray-300 font-mono break-all bg-gray-700/50 p-2 rounded">
                  {miningResult.block.hash}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};