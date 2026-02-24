import React from 'react';
import { formatCurrency, formatNumber } from '../services/marketEngine';
import { Trophy, RefreshCcw, Frown } from 'lucide-react';

interface GameOverModalProps {
  finalNetWorth: number;
  initialCash: number;
  tradeCount: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  finalNetWorth, 
  initialCash, 
  tradeCount, 
  onRestart 
}) => {
  const profit = finalNetWorth - initialCash;
  const isProfit = profit >= 0;
  const percentReturn = (profit / initialCash) * 100;

  // Updated images based on user request.
  const winImage = "https://free.picui.cn/free/2026/02/23/699bca910be57.png";
  const loseImage = "https://free.picui.cn/free/2026/02/23/699bc914f2c40.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className={`
        relative w-full max-w-sm md:max-w-md 
        bg-slate-900 border-2 rounded-2xl shadow-2xl overflow-hidden
        flex flex-col transform transition-all
        ${isProfit ? 'border-green-500/50 shadow-green-500/20' : 'border-red-500/50 shadow-red-500/20'}
      `}>
        
        {/* Decorative background glow */}
        <div className={`absolute top-0 left-0 right-0 h-40 opacity-20 bg-gradient-to-b ${isProfit ? 'from-green-500' : 'from-red-500'} to-transparent pointer-events-none`} />

        <div className="relative p-6 flex flex-col items-center text-center">
          
          {/* Header Title */}
          <h2 className={`text-3xl md:text-4xl font-black uppercase mb-1 drop-shadow-sm ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {isProfit ? '大获全胜' : '惨淡离场'}
          </h2>
          <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mb-5 opacity-70">
            SESSION CLOSED
          </p>

          {/* MEME IMAGE AREA */}
          <div className="w-full aspect-video bg-slate-950 rounded-xl border border-slate-700/50 mb-6 overflow-hidden flex items-center justify-center relative shadow-inner">
             <img 
               src={isProfit ? winImage : loseImage} 
               alt={isProfit ? "吃到肉了" : "不玩了把钱还我"}
               className="w-full h-full object-contain bg-black"
             />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            {/* Net Worth Block */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">最终资产</span>
              <span className={`text-lg md:text-xl font-mono font-bold tracking-tight ${isProfit ? 'text-white' : 'text-slate-200'}`}>
                {formatCurrency(finalNetWorth)}
              </span>
            </div>
            
            {/* Return % Block */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">收益率</span>
               <span className={`text-lg md:text-xl font-mono font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {isProfit ? '+' : ''}{formatNumber(percentReturn)}%
              </span>
            </div>

            {/* Trade Count Footer */}
            <div className="col-span-2 bg-slate-800/40 p-2 rounded-lg border border-slate-700/30 flex items-center justify-center gap-2">
                <span className="text-xs text-slate-500 font-medium">本次共执行</span>
                <span className="text-sm font-mono text-slate-300 font-bold">{tradeCount}</span>
                <span className="text-xs text-slate-500 font-medium">笔交易</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={onRestart}
            className={`
              w-full py-4 rounded-xl font-bold text-base md:text-lg text-white shadow-lg transition-all active:scale-[0.98]
              flex items-center justify-center gap-2
              ${isProfit 
                ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' 
                : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
              }
            `}
          >
            {isProfit ? <Trophy className="w-5 h-5" /> : <Frown className="w-5 h-5" />}
            <span>{isProfit ? '再赢一局' : '不服，重来'}</span>
            <RefreshCcw className="w-4 h-4 opacity-50 ml-1" />
          </button>

        </div>
      </div>
    </div>
  );
};