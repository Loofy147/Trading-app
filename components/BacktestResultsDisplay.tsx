
import React from 'react';
import type { BacktestResults } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, PresentationChartLineIcon, ScaleIcon } from './Icons';

interface BacktestResultsDisplayProps {
  results: BacktestResults;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
        <div className={`p-3 rounded-md mr-4 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);


export const BacktestResultsDisplay: React.FC<BacktestResultsDisplayProps> = ({ results }) => {
    const pnlColor = results.totalPnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
    const pnlIcon = <CurrencyDollarIcon className="h-6 w-6" />;

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Backtest Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total P/L" value={`$${results.totalPnl.toFixed(2)}`} icon={pnlIcon} colorClass={pnlColor} />
                <StatCard title="Win Rate" value={`${results.winRate.toFixed(2)}%`} icon={<PresentationChartLineIcon className="h-6 w-6" />} colorClass="bg-blue-500/20 text-blue-400" />
                <StatCard title="Total Trades" value={results.totalTrades} icon={<ChartBarIcon className="h-6 w-6" />} colorClass="bg-indigo-500/20 text-indigo-400" />
                <StatCard title="Sharpe Ratio" value={results.sharpeRatio.toFixed(2)} icon={<ScaleIcon className="h-6 w-6" />} colorClass="bg-purple-500/20 text-purple-400" />
            </div>
        </div>
    );
};
