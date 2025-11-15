
import React from 'react';
import { PlayIcon } from './Icons';

interface StrategyInputProps {
  rawStrategy: string;
  setRawStrategy: (value: string) => void;
  onBacktest: () => void;
  isLoading: boolean;
}

export const StrategyInput: React.FC<StrategyInputProps> = ({ rawStrategy, setRawStrategy, onBacktest, isLoading }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg ring-1 ring-white/10">
      <h2 className="text-lg font-semibold text-white mb-4">Trading Strategy</h2>
      <p className="text-sm text-gray-400 mb-4">
        Enter your trading strategy below. Our AI will analyze it, structure it, and run a simulated backtest.
      </p>
      <textarea
        className="w-full h-48 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-200 placeholder-gray-500 resize-none"
        placeholder="Describe your entry, confirmation, and exit criteria..."
        value={rawStrategy}
        onChange={(e) => setRawStrategy(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onBacktest}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
      >
        {isLoading ? (
          'Analyzing & Backtesting...'
        ) : (
          <>
            <PlayIcon className="h-5 w-5 mr-2" />
            Analyze & Backtest
          </>
        )}
      </button>
    </div>
  );
};
