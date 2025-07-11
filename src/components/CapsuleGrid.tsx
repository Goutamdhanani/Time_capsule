import React, { useState } from 'react';
import { Clock, Lock, Unlock, Calendar, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useApi } from '../hooks/useApi';
import { TimeCapsule } from '../types';

export const CapsuleGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unlock-date'>('newest');

  const { data: capsules, loading, error } = useApi<TimeCapsule[]>('/api/capsules');

  const filteredCapsules = capsules?.filter(capsule => {
    const matchesSearch =
      capsule.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'unlocked' && capsule.isUnlocked) ||
      (filter === 'locked' && !capsule.isUnlocked);

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'unlock-date':
        return new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading time capsules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to load capsules</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Time Capsules</h2>
        <p className="text-gray-400">Discover messages from the past and future</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search capsules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unlocked' | 'locked')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="all">All Capsules</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'unlock-date')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="unlock-date">Unlock Date</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules?.map((capsule, index) => (
          <CapsuleCard
            key={capsule.id || `${capsule.sender_name}-${capsule.createdAt}-${index}`}
            capsule={capsule}
          />
        ))}
      </div>

      {filteredCapsules?.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No capsules found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

interface CapsuleCardProps {
  capsule: TimeCapsule;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isUnlocked = capsule.isUnlocked || new Date() >= new Date(capsule.unlockDate);

  return (
    <div
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-white font-medium">{capsule.sender_name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isUnlocked ? (
              <Unlock className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm ${isUnlocked ? 'text-green-500' : 'text-red-500'}`}>
              {isUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p
            className={`text-gray-300 line-clamp-3 transition-all duration-300 ${
              isUnlocked ? 'opacity-100' : 'opacity-50 blur-sm'
            }`}
          >
            {isUnlocked ? capsule.message : 'Message will be revealed when unlocked...'}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Unlock: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {isHovered && (
        <div className="px-6 pb-4 transition-all duration-300">
          <Button variant="outline" size="small" className="w-full">
            View Details
          </Button>
        </div>
      )}
    </div>
  );
};
