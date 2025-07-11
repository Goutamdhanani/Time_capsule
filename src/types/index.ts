export interface TimeCapsule {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  unlockDate: string;
  isPublic: boolean;
  isUnlocked: boolean;
  blockIndex?: number;
  hash?: string;
  createdAt: string;
}

export interface Block {
  index: number;
  timestamp: string;
  data: TimeCapsule[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
}

export interface BlockchainData {
  chain: Block[];
  difficulty: number;
  miningReward: number;
  pendingTransactions: TimeCapsule[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface MiningResult {
  block: Block;
  minedAt: string;
  executionTime: number;
}

export interface NetworkStatus {
  isOnline: boolean;
  lastSync: string;
  blockHeight: number;
  pendingCount: number;
}