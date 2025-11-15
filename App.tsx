
import React, { useState, useCallback } from 'react';
import { StrategyInput } from './components/StrategyInput';
import { StructuredStrategyDisplay } from './components/StructuredStrategyDisplay';
import { BacktestChart } from './components/BacktestChart';
import { BacktestResultsDisplay } from './components/BacktestResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeStrategy } from './services/geminiService';
import { generateMockData, runBacktest } from './services/backtestingService';
import type { StructuredStrategy, BacktestResults, PriceData } from './types';
import { GithubIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [rawStrategy, setRawStrategy] = useState<string>(
`1. Liquidity sweep of 1hr, 4hr, or session highs/lows.
2. Confirmation: BOS, iFVG, SMT, 79% extension.
3. Continuation: Look for EQ or FVG. If liquidity sweep was premarket, look for an SMT.
4. Final confirmation: Another BOS, iFVG, SMT, or 79% extension.
5. Entry.
6. Target previous draws on liquidity in our direction.`
  );
  const [structuredStrategy, setStructuredStrategy] = useState<StructuredStrategy | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResults | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeAndBacktest = useCallback(async () => {
    if (!rawStrategy.trim()) {
      setError('Strategy input cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setStructuredStrategy(null);
    setBacktestResults(null);
    setPriceData([]);

    try {
      const structured = await analyzeStrategy(rawStrategy);
      setStructuredStrategy(structured);

      const mockData = generateMockData(200);
      setPriceData(mockData);

      const results = runBacktest(mockData, structured);
      setBacktestResults(results);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [rawStrategy]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Gemini Trading Strategy Backtester</h1>
            </div>
            <a href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/get-started/tutorial.md" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col space-y-8">
            <StrategyInput
              rawStrategy={rawStrategy}
              setRawStrategy={setRawStrategy}
              onBacktest={handleAnalyzeAndBacktest}
              isLoading={isLoading}
            />
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}
            {isLoading && !structuredStrategy && (
              <div className="flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg h-64">
                <LoadingSpinner />
                <p className="mt-4 text-gray-400">Analyzing strategy with Gemini...</p>
              </div>
            )}
            {structuredStrategy && <StructuredStrategyDisplay strategy={structuredStrategy} />}
          </div>

          <div className="lg:col-span-2 flex flex-col space-y-8">
            <div className="bg-gray-800/50 rounded-lg p-2 md:p-4 shadow-2xl ring-1 ring-white/10">
              {priceData.length > 0 ? (
                <BacktestChart priceData={priceData} trades={backtestResults?.trades || []} />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <p>Run a backtest to see the chart.</p>
                </div>
              )}
            </div>
            {backtestResults && <BacktestResultsDisplay results={backtestResults} />}
             {isLoading && structuredStrategy && (
              <div className="flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg">
                <LoadingSpinner />
                <p className="mt-4 text-gray-400">Running backtest simulation...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm border-t border-gray-700/50 mt-8">
        <p>Disclaimer: This is a simulation for educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
};

export default App;
