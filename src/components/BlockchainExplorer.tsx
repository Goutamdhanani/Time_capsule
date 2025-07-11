import React, { useState } from 'react';
import { Blocks, Hash, Clock, Database, ChevronRight, ChevronDown } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { BlockchainData, Block } from '../types';

export const BlockchainExplorer: React.FC = () => {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const { data: blockchain, loading, error } = useApi<BlockchainData>('/chain');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Blocks className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to load blockchain</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Blockchain Explorer</h2>
        <p className="text-gray-400">Explore the time capsule blockchain</p>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Blocks className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Blocks</p>
              <p className="text-2xl font-bold text-white">{blockchain?.chain.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Capsules</p>
              <p className="text-2xl font-bold text-white">
                {blockchain?.chain.reduce((total, block) => total + block.data.length, 0) || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">{blockchain?.pendingTransactions.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Difficulty</p>
              <p className="text-2xl font-bold text-white">{blockchain?.difficulty || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Visualization */}
      <div className="space-y-4">
        {blockchain?.chain.map((block, index) => (
          <BlockCard
            key={block.index}
            block={block}
            isExpanded={expandedBlock === block.index}
            onToggle={() => setExpandedBlock(expandedBlock === block.index ? null : block.index)}
            isLatest={index === blockchain.chain.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

interface BlockCardProps {
  block: Block;
  isExpanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
}

const BlockCard: React.FC<BlockCardProps> = ({ block, isExpanded, onToggle, isLatest }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden transition-all duration-300">
      <div
        className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isLatest ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
            }`}>
              <Blocks className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Block #{block.index}</h3>
              <p className="text-sm text-gray-400">
                {new Date(block.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Capsules</p>
              <p className="text-lg font-bold text-white">{block.data.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Nonce</p>
              <p className="text-lg font-bold text-white">{block.nonce}</p>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Hash</h4>
              <p className="text-xs text-gray-400 font-mono break-all">{block.hash}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Previous Hash</h4>
              <p className="text-xs text-gray-400 font-mono break-all">{block.previousHash}</p>
            </div>
          </div>
          
          {block.data.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Time Capsules</h4>
              <div className="space-y-2">
                {block.data.map((capsule, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div>
                      <p className="text-white font-medium">{capsule.name}</p>
                      <p className="text-xs text-gray-400">{capsule.message.substring(0, 50)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(capsule.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};