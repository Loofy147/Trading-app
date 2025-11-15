
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
} from 'recharts';
import type { PriceData, Trade } from '../types';

interface BacktestChartProps {
  priceData: PriceData[];
  trades: Trade[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-700/80 backdrop-blur-sm p-3 border border-gray-600 rounded-lg text-sm">
        <p className="text-gray-200">{`Time: ${data.time}`}</p>
        <p className="text-blue-400">{`Price: ${data.close.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export const BacktestChart: React.FC<BacktestChartProps> = ({ priceData, trades }) => {
  const buyTrades = trades.filter(t => t.type === 'buy').map(t => ({ time: t.entryTime, price: t.entryPrice }));
  const sellTrades = trades.filter(t => t.type === 'sell').map(t => ({ time: t.entryTime, price: t.entryPrice }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart data={priceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            orientation="right"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Price" />
          <Scatter name="Buy" data={buyTrades} fill="#22c55e" shape="triangle" />
          <Scatter name="Sell" data={sellTrades} fill="#ef4444" shape="cross" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
