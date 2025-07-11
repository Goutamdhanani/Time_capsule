import React, { useState } from 'react';
import { Header } from './components/Header';
import { TimeCapsuleForm } from './components/TimeCapsuleForm';
import { CapsuleGrid } from './components/CapsuleGrid';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { MiningInterface } from './components/MiningInterface';

function App() {
  const [activeTab, setActiveTab] = useState('capsules');

  const renderContent = () => {
    switch (activeTab) {
      case 'capsules':
        return (
          <div className="space-y-8">
            <TimeCapsuleForm />
            <CapsuleGrid />
          </div>
        );
      case 'explorer':
        return <BlockchainExplorer />;
      case 'community':
        return <CapsuleGrid />;
      case 'mining':
        return <MiningInterface />;
      default:
        return <CapsuleGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;