
import type { PriceData, BacktestResults, StructuredStrategy, Trade } from '../types';

// Generates mock price data with some trend and noise
export const generateMockData = (numPoints: number): PriceData[] => {
  const data: PriceData[] = [];
  let price = 100;
  for (let i = 0; i < numPoints; i++) {
    const change = (Math.random() - 0.48) * 5 + Math.sin(i / 20) * 2;
    const open = price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    data.push({ time: i, open, high, low, close });
    price = close;
  }
  return data;
};

// Helper function to evaluate a single trading condition
const evaluateCondition = (condition: string, data: PriceData[], currentIndex: number): boolean => {
  const lowerCaseCondition = condition.toLowerCase();
  const recentData = data.slice(currentIndex - 10, currentIndex);
  const currentCandle = data[currentIndex];

  if (!recentData.length) return false;

  // Example condition: "Liquidity sweep of highs"
  if (lowerCaseCondition.includes('liquidity sweep')) {
    if (lowerCaseCondition.includes('high')) {
      const recentHigh = Math.max(...recentData.map(p => p.high));
      return currentCandle.high > recentHigh;
    }
    if (lowerCaseCondition.includes('low')) {
      const recentLow = Math.min(...recentData.map(p => p.low));
      return currentCandle.low < recentLow;
    }
  }

  // Example condition: "Break of Structure (BOS)"
  if (lowerCaseCondition.includes('bos') || lowerCaseCondition.includes('break of structure')) {
    const recentHigh = Math.max(...recentData.map(p => p.high));
    return currentCandle.close > recentHigh;
  }

  // Add more sophisticated condition evaluations here...

  // If the condition is not recognized, we'll conservatively return false.
  // A more robust solution might involve more advanced NLP or a stricter schema.
  return false;
};


// Helper function to determine the exit point based on strategy targets
const determineExit = (
  exitTargets: string[],
  data: PriceData[],
  entryIndex: number,
  entryPrice: number,
  tradeType: 'buy' | 'sell'
): { exitPrice: number; exitTime: number } => {
  // Default exit: time-based stop after 10 candles or a 2% stop-loss
  const timeStop = Math.min(entryIndex + 10, data.length - 1);
  const stopLossPrice = tradeType === 'buy' ? entryPrice * 0.98 : entryPrice * 1.02;

  for (const target of exitTargets) {
    const lowerCaseTarget = target.toLowerCase();

    // Example Target: "Draw on liquidity" -> target a recent low for a sell trade
    if (lowerCaseTarget.includes('draw on liquidity') || lowerCaseTarget.includes('recent low')) {
        if (tradeType === 'sell') {
            const recentLow = Math.min(...data.slice(entryIndex - 10, entryIndex).map(p => p.low));
            for (let j = entryIndex + 1; j <= timeStop; j++) {
                if (data[j].low <= recentLow) {
                    return { exitPrice: recentLow, exitTime: data[j].time };
                }
                if (data[j].high >= stopLossPrice) { // Check stop loss
                    return { exitPrice: stopLossPrice, exitTime: data[j].time };
                }
            }
        }
    }
  }

  // If no specific target is met, exit at the time stop or stop-loss
  return { exitPrice: stopLossPrice, exitTime: data[timeStop].time };
};

// Backtesting engine that interprets the structured strategy
export const runBacktest = (
  data: PriceData[],
  strategy: StructuredStrategy
): BacktestResults => {
  const trades: Trade[] = [];

  for (let i = 10; i < data.length - 10; i++) {
    // Check all entry conditions are met for the current candle
    const entryConditionsMet = strategy.entryConditions.every(cond =>
      evaluateCondition(cond, data, i)
    );

    if (entryConditionsMet) {
      // Check all confirmation signals are met
      const confirmationSignalsMet = strategy.confirmationSignals.every(cond =>
        evaluateCondition(cond, data, i)
      );

      if (confirmationSignalsMet) {
        const entryPrice = data[i].close;
        const entryTime = data[i].time;

        // For simplicity, we assume a 'sell' trade if we sweep highs.
        // A real engine would have logic to determine long/short.
        const tradeType = 'sell';

        const { exitPrice, exitTime } = determineExit(
          strategy.exitTargets,
          data,
          i,
          entryPrice,
          tradeType
        );

        const profit = tradeType === 'sell' ? entryPrice - exitPrice : exitPrice - entryPrice;

        trades.push({
          entryTime,
          entryPrice,
          exitTime,
          exitPrice,
          profit,
          type: tradeType,
        });

        // Skip forward in the data to the end of this trade to avoid overlapping trades
        i = exitTime;
      }
    }
  }

  const totalTrades = trades.length;
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalPnl: 0,
      averagePnl: 0,
      sharpeRatio: 0,
      trades: [],
    };
  }

  const winningTrades = trades.filter(t => t.profit > 0).length;
  const winRate = (winningTrades / totalTrades) * 100;
  const totalPnl = trades.reduce((sum, t) => sum + t.profit, 0);
  const averagePnl = totalPnl / totalTrades;

  const pnlValues = trades.map(t => t.profit);
  const pnlStdDev = Math.sqrt(pnlValues.map(x => Math.pow(x - averagePnl, 2)).reduce((a, b) => a + b) / totalTrades);
  const sharpeRatio = pnlStdDev > 0 ? averagePnl / pnlStdDev : 0;

  return {
    totalTrades,
    winRate,
    totalPnl,
    averagePnl,
    sharpeRatio,
    trades,
  };
};
