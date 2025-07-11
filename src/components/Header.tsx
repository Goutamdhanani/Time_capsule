import React from 'react';
import { Clock, Blocks, Users, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'capsules', label: 'Time Capsules', icon: Clock },
    { id: 'explorer', label: 'Blockchain Explorer', icon: Blocks },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'mining', label: 'Mining', icon: Settings }
  ];

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">TimeCapsule</h1>
          </div>
          
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    flex items-center space-x-2
                    ${activeTab === tab.id 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};