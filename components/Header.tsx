import React from 'react';
import { formatCurrency, formatNumber } from '../services/marketEngine';

interface HeaderProps {
  cash: number;
  holdings: number;
  currentPrice: number;
  initialCash: number;
}

export const Header: React.FC<HeaderProps> = ({ cash, holdings, currentPrice, initialCash }) => {
  const holdingsValue = holdings * currentPrice;
  const netWorth = cash + holdingsValue;
  const initialNetWorth = initialCash; 
  const profitLoss = netWorth - initialNetWorth;
  const profitLossPercent = (profitLoss / initialNetWorth) * 100;
  
  const plColor = profitLoss >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-2 md:p-4 shadow-md z-10 shrink-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-6xl mx-auto">
        
        {/* Net Worth */}
        <div className="bg-slate-800/50 p-2 md:p-3 rounded-lg border border-slate-700">
          <p className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">总资产</p>
          <p className={`text-lg md:text-2xl font-bold tracking-tight ${plColor}`}>
            {formatCurrency(netWorth)}
          </p>
        </div>

        {/* P/L */}
        <div className="bg-slate-800/50 p-2 md:p-3 rounded-lg border border-slate-700">
          <p className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">总盈亏</p>
          <div className="flex items-baseline space-x-1 md:space-x-2">
            <span className={`text-lg md:text-2xl font-bold ${plColor}`}>
              {profitLossPercent > 0 ? '+' : ''}{formatNumber(profitLossPercent)}%
            </span>
          </div>
        </div>

        {/* Cash */}
        <div className="bg-slate-800/50 p-2 md:p-3 rounded-lg border border-slate-700">
          <p className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">现金</p>
          <p className="text-lg md:text-xl font-mono text-slate-100 truncate">
            {formatCurrency(cash)}
          </p>
        </div>

        {/* Holdings */}
        <div className="bg-slate-800/50 p-2 md:p-3 rounded-lg border border-slate-700">
          <p className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">持仓</p>
          <div className="flex justify-between items-end">
             <p className="text-lg md:text-xl font-mono text-slate-100">{formatNumber(holdings)}</p>
             <p className="text-[10px] md:text-xs text-slate-500 mb-1 hidden sm:block">@ {formatNumber(currentPrice)}</p>
          </div>
         
        </div>

      </div>
    </div>
  );
};