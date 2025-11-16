
import React from 'react';
import type { StructuredStrategy } from '../types';
import { CheckCircleIcon, LoginIcon, ShieldCheckIcon, LogoutIcon } from './Icons';

interface StructuredStrategyDisplayProps {
  strategy: StructuredStrategy;
}

const StrategySection: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
  <div>
    <h4 className="text-md font-semibold text-gray-200 flex items-center mb-2">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    <ul className="space-y-2 pl-6">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-gray-400 flex items-start">
          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
      {items.length === 0 && <li className="text-sm text-gray-500 italic">Not specified</li>}
    </ul>
  </div>
);

export const StructuredStrategyDisplay: React.FC<StructuredStrategyDisplayProps> = ({ strategy }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-fade-in">
      <h3 className="text-lg font-bold text-white mb-2">{strategy.strategyName}</h3>
      <p className="text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">{strategy.description}</p>
      <div className="space-y-6">
        <StrategySection title="Entry Conditions" items={strategy.entryConditions} icon={<LoginIcon className="h-5 w-5 text-blue-400"/>} />
        <StrategySection title="Confirmation Signals" items={strategy.confirmationSignals} icon={<ShieldCheckIcon className="h-5 w-5 text-yellow-400"/>} />
        <StrategySection title="Exit Targets" items={strategy.exitTargets} icon={<LogoutIcon className="h-5 w-5 text-red-400"/>} />
      </div>
    </div>
  );
};
