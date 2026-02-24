import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  ComposedChart
} from 'recharts';
import { PricePoint, Trade } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  trades: Trade[];
  currentPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, trades, currentPrice }) => {
  // User Requirement:
  // 1. Lower bound = Fixed at 20.
  // 2. Upper bound = Scales with the maximum price seen (ensure full curve is visible).
  // 3. Ensure latest price is visible.
  
  // Calculate the maximum price ever reached in the current session
  const allPrices = [
    ...data.map(d => d.price),
    ...trades.map(t => t.price),
    currentPrice
  ];

  const maxDataPrice = Math.max(...allPrices);

  // Fixed Lower Bound: 20
  const yMin = 20;

  // Dynamic Upper Bound: Max price + 10% padding to prevent touching the top edge
  const yMax = Math.ceil(maxDataPrice * 1.1);

  return (
    <div className="w-full h-full p-2 bg-slate-950 relative">
      {/* Current Price Watermark */}
      <div className="absolute top-4 right-8 z-0 pointer-events-none opacity-10">
        <h1 className="text-6xl md:text-8xl font-black text-slate-100 tracking-tighter">
          {currentPrice.toFixed(2)}
        </h1>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="tick" 
            hide={true} 
            type="number"
            domain={['auto', 'auto']}
            isAnimationActive={false}
          />
          <YAxis 
            domain={[yMin, yMax]} 
            orientation="right" 
            stroke="#475569"
            tickFormatter={(val) => val.toFixed(0)}
            tick={{ fontSize: 11, fill: '#64748b' }}
            width={40}
            allowDataOverflow={false} // Allow scale to expand to fit data
            isAnimationActive={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#e2e8f0' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [value.toFixed(2), "价格"]}
          />
          
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
            animationDuration={300}
          />

          {trades.map((trade) => (
             <ReferenceDot
                key={trade.id}
                x={trade.timestamp}
                y={trade.price}
                r={4}
                fill={trade.type === 'BUY' ? '#ef4444' : '#22c55e'}
                stroke="#fff"
                strokeWidth={1.5}
                isAnimationActive={false}
             />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};