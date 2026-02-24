import React, { useState, useEffect } from 'react';
import { formatCurrency, formatNumber } from '../services/marketEngine';

interface ControlsProps {
  cash: number;
  holdings: number;
  currentPrice: number;
  onBuy: (amount: number) => void;
  onSell: (shares: number) => void;
  disabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  cash, 
  holdings, 
  currentPrice, 
  onBuy, 
  onSell,
  disabled
}) => {
  const [percentage, setPercentage] = useState(50);
  
  // Calculate potential trade values
  const buyAmount = cash * (percentage / 100);
  const buyShares = buyAmount / currentPrice;
  
  const sellShares = holdings * (percentage / 100);
  const sellValue = sellShares * currentPrice;

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 pb-safe md:p-4 md:pb-8 z-20 shrink-0">
      <div className="max-w-4xl mx-auto flex flex-col gap-3 md:gap-6">
        
        {/* Slider Section */}
        <div className="flex flex-col gap-1 md:gap-2">
           <div className="flex justify-between text-xs md:text-sm font-medium text-slate-400">
             <span>1%</span>
             <span className="text-slate-100 text-sm md:text-base">{percentage}% 仓位</span>
             <span>100%</span>
           </div>
           <input
             type="range"
             min="1"
             max="100"
             value={percentage}
             onChange={(e) => setPercentage(parseInt(e.target.value))}
             disabled={disabled}
             className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all touch-none"
           />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 h-14 md:h-16">
           <button
             onClick={() => onBuy(buyAmount)}
             disabled={disabled || cash < 10}
             className="relative group bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-red-900/20 flex flex-col items-center justify-center border-b-4 border-red-800 hover:border-red-700 disabled:border-transparent"
           >
             <span className="text-lg md:text-xl font-bold tracking-widest">买入</span>
             <span className="text-[10px] md:text-xs opacity-75 font-mono">
               {formatCurrency(buyAmount)}
             </span>
           </button>

           <button
             onClick={() => onSell(sellShares)}
             disabled={disabled || holdings <= 0}
             className="relative group bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-green-900/20 flex flex-col items-center justify-center border-b-4 border-green-800 hover:border-green-700 disabled:border-transparent"
           >
             <span className="text-lg md:text-xl font-bold tracking-widest">卖出</span>
             <span className="text-[10px] md:text-xs opacity-75 font-mono">
               {formatCurrency(sellValue)}
             </span>
           </button>
        </div>
      </div>
    </div>
  );
};