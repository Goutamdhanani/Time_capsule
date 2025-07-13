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

// Capsule format returned in mined blocks (uses snake_case and UNIX timestamps)
export interface MinedCapsule {
  sender_name: string;
  message: string;
  is_public: boolean;
  lock_until: number;       // UNIX timestamp
  created_at: number;       // UNIX timestamp
}


export interface Block {
  index: number;
  timestamp: number; // UNIX timestamp
  data: MinedCapsule[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
}

export interface BlockchainData {
  chain: Block[];
  difficulty: number;
  miningReward: number;
  pendingTransactions: MinedCapsule[];
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
