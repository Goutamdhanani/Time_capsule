// src/components/BlockchainExplorer.tsx
import React, { useState } from 'react';
import {
  Blocks,
  Hash,
  Clock,
  Database,
  ChevronRight,
  ChevronDown,
  ClipboardCopy
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { BlockchainData, Block as BlockType, MinedCapsule } from '../types';
import clsx from 'clsx';

export const BlockchainExplorer: React.FC = () => {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const { data: blockchain, loading, error } = useApi<BlockchainData>('/chain');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading blockchain data…</p>
        </div>
      </div>
    );
  }

  if (error || !blockchain) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <Blocks className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            Failed to load blockchain
          </h3>
          <p className="text-gray-400">{error || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <StatsGrid data={blockchain} />
      <div className="space-y-6">
        {blockchain.chain.map((blk, idx) => (
          <BlockCard
            key={blk.index}
            block={blk}
            isExpanded={expandedBlock === blk.index}
            onToggle={() =>
              setExpandedBlock(expandedBlock === blk.index ? null : blk.index)
            }
            isLatest={idx === blockchain.chain.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

type StatsGridProps = { data: BlockchainData };
const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const totalCapsules = data.chain.reduce(
    (sum, blk) => sum + blk.data.length,
    0,
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <StatCard
        icon={<Blocks className="w-6 h-6 text-blue-500" />}
        label="Total Blocks"
        value={data.chain.length}
        color="blue"
      />
      <StatCard
        icon={<Database className="w-6 h-6 text-green-500" />}
        label="Total Capsules"
        value={totalCapsules}
        color="green"
      />
      <StatCard
        icon={<Clock className="w-6 h-6 text-yellow-500" />}
        label="Pending"
        value={data.pendingTransactions.length}
        color="yellow"
      />
      <StatCard
        icon={<Hash className="w-6 h-6 text-purple-500" />}
        label="Difficulty"
        value={data.difficulty}
        color="purple"
      />
    </div>
  );
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
};
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-700 p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
    <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

type BlockCardProps = {
  block: BlockType;
  isExpanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
};
const BlockCard: React.FC<BlockCardProps> = ({ block, isExpanded, onToggle, isLatest }) => {
  const ts = new Date(block.timestamp * 1000).toLocaleString();
  return (
    <div
      className={clsx(
        'bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300',
        isExpanded && 'shadow-2xl'
      )}
    >
      <div
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-800/50 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div
            className={clsx(
              'w-14 h-14 rounded-lg flex items-center justify-center',
              isLatest ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
            )}
          >
            <Blocks className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Block #{block.index}</h3>
            <p className="text-sm text-gray-400">{ts}</p>
          </div>
        </div>
        <div className="text-right flex items-center space-x-6">
          <div>
            <p className="text-sm text-gray-400">Capsules</p>
            <p className="text-lg font-bold text-white">{block.data.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Nonce</p>
            <p className="text-lg font-bold text-white">{block.nonce}</p>
          </div>
          <div>{isExpanded ? <ChevronDown className="w-6 h-6 text-gray-400" /> : <ChevronRight className="w-6 h-6 text-gray-400" />}</div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-8 space-y-6 animate-fadeIn">
          <HashesSection block={block} />
          <CapsuleList data={block.data} />
        </div>
      )}
    </div>
  );
};

const HashesSection: React.FC<{ block: BlockType }> = ({ block }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { label: 'Hash', value: block.hash },
      { label: 'Previous Hash', value: block.previousHash },
    ].map(({ label, value }, idx) => (
      <div key={idx} className="bg-gray-800/50 rounded-md p-4 relative">
        <h4 className="text-sm font-medium text-gray-300 mb-2">{label}</h4>
        <p className="text-xs text-gray-400 font-mono break-all">{value}</p>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-200"
          title="Copy to clipboard"
        >
          <ClipboardCopy className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);

const CapsuleList: React.FC<{ data: MinedCapsule[] }> = ({ data }) => {
  const now = Date.now();

  if (data.length === 0) {
    return <p className="text-gray-500 italic">No capsules in this block.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((capsule, idx) => {
        const unlockMs = capsule.lock_until * 1000;
        const createdMs = capsule.created_at * 1000;
        const isUnlocked = capsule.is_public && now >= unlockMs;

        return (
          <div
            key={idx}
            className={clsx(
              'bg-gray-800/60 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-700 hover:shadow-lg transition-shadow'
            )}
          >
            <div className="col-span-2 space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-white font-semibold">{capsule.sender_name}</p>
                <span
                  className={clsx(
                    'text-xs font-semibold',
                    isUnlocked ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <p className={clsx('text-gray-300 transition-opacity', !isUnlocked && 'opacity-60 blur-sm')}>
                {isUnlocked
                  ? capsule.message
                  : '🔒 Message will be revealed once unlocked.'}
              </p>
            </div>
            <div className="text-sm text-gray-400 space-y-1 text-right">
              <div>
                <p>Created:</p>
                <p className="text-white">
                  {new Date(createdMs).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p>Unlocks:</p>
                <p className={clsx(isUnlocked ? 'text-green-400' : 'text-red-400')}>
                  {new Date(unlockMs).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
