
export interface StructuredStrategy {
  strategyName: string;
  description: string;
  entryConditions: string[];
  confirmationSignals: string[];
  exitTargets: string[];
}

export interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Trade {
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  profit: number;
  type: 'buy' | 'sell';
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  averagePnl: number;
  sharpeRatio: number;
  trades: Trade[];
}
