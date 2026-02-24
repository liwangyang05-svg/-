import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameStatus, 
  GameState, 
  PricePoint, 
  Trade, 
  EventType 
} from './types';
import { 
  INITIAL_CASH, 
  INITIAL_PRICE, 
  GAME_DURATION_SECONDS, 
  TICK_RATE_MS, 
  EVENTS 
} from './constants';
import { calculateNextPrice } from './services/marketEngine';
import { Header } from './components/Header';
import { PriceChart } from './components/PriceChart';
import { Controls } from './components/Controls';
import { EventBanner } from './components/EventBanner';
import { GameOverModal } from './components/GameOverModal';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameStatus>(GameStatus.IDLE);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [holdings, setHoldings] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([{ tick: 0, price: INITIAL_PRICE }]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [activeEvent, setActiveEvent] = useState<GameState['activeEvent']>(null);
  
  // Refs for intervals and mutable values needed in loops
  const tickRef = useRef<number>(0);
  const eventTimeLeftRef = useRef<number>(0);
  const eventCooldownRef = useRef<number>(75); // ticks before first event

  // --- Game Loop Logic ---

  const triggerRandomEvent = useCallback(() => {
    const roll = Math.random();
    let newEvent = null;

    if (roll < 0.25) newEvent = EVENTS[EventType.RATE_CUT];
    else if (roll < 0.50) newEvent = EVENTS[EventType.REG_CRACKDOWN];
    else if (roll < 0.75) newEvent = EVENTS[EventType.EARNINGS_BEAT];
    else newEvent = EVENTS[EventType.BLACK_SWAN];

    if (newEvent) {
      setActiveEvent(newEvent);
      eventTimeLeftRef.current = newEvent.duration;

      // Immediate Black Swan Impact
      if (newEvent.type === EventType.BLACK_SWAN) {
        setCurrentPrice(prev => {
          const drop = 0.15 + (Math.random() * 0.05); // 15-20% drop
          return Math.max(0.01, prev * (1 - drop));
        });
      }
    }
  }, []);

  const handleTick = useCallback(() => {
    // Legacy tick handler - logic moved to useEffect interval for better synchronization
    // kept for reference or if we switch back to requestAnimationFrame
  }, []);


  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === GameStatus.PLAYING) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GameStatus.ENDED);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Market Ticker Effect
  useEffect(() => {
    let ticker: ReturnType<typeof setInterval>;
    if (gameState === GameStatus.PLAYING) {
       // Placeholder for potential separate loop, currently merged below
    }
    return () => clearInterval(ticker);
  }, [gameState]);

  // FIX: Using a single precise interval for the game loop to avoid synchronization issues
  useEffect(() => {
    if (gameState !== GameStatus.PLAYING) return;

    const interval = setInterval(() => {
      // 1. Manage Event Timers
      if (activeEvent) {
         eventTimeLeftRef.current -= 1;
         if (eventTimeLeftRef.current <= 0) {
            setActiveEvent(null);
            eventCooldownRef.current = 150; // Reset cooldown ~30s
         }
      } else {
         eventCooldownRef.current -= 1;
         if (eventCooldownRef.current <= 0) {
            triggerRandomEvent();
         }
      }

      // 2. Calculate New Price
      setCurrentPrice(prev => {
        const next = calculateNextPrice(prev, activeEvent);
        
        // 3. Update History (using the value we just calculated to be perfectly in sync)
        setPriceHistory(h => [
          ...h, 
          { tick: tickRef.current, price: next, event: activeEvent?.type }
        ]);
        
        return next;
      });

      tickRef.current += 1;

    }, TICK_RATE_MS);

    return () => clearInterval(interval);
  }, [gameState, activeEvent, triggerRandomEvent]);


  // --- User Actions ---

  const handleStart = () => {
    setGameState(GameStatus.PLAYING);
    setCash(INITIAL_CASH);
    setHoldings(0);
    setCurrentPrice(INITIAL_PRICE);
    setPriceHistory([{ tick: 0, price: INITIAL_PRICE }]);
    setTrades([]);
    setTimeLeft(GAME_DURATION_SECONDS);
    setActiveEvent(null);
    tickRef.current = 0;
    eventTimeLeftRef.current = 0;
    eventCooldownRef.current = 75; // First event happens after 15s (75 ticks)
  };

  const handleBuy = (amount: number) => {
    if (gameState !== GameStatus.PLAYING) return;
    if (cash < amount) return;

    const quantity = amount / currentPrice;
    
    setCash(prev => prev - amount);
    setHoldings(prev => prev + quantity);
    
    setTrades(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'BUY',
      price: currentPrice,
      amount: amount,
      quantity: quantity,
      timestamp: tickRef.current
    }]);
  };

  const handleSell = (quantity: number) => {
    if (gameState !== GameStatus.PLAYING) return;
    if (holdings < quantity) return;

    const amount = quantity * currentPrice;

    setHoldings(prev => prev - quantity);
    setCash(prev => prev + amount);

    setTrades(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'SELL',
      price: currentPrice,
      amount: amount,
      quantity: quantity,
      timestamp: tickRef.current
    }]);
  };

  // --- Render Helpers ---
  const isBlackSwan = activeEvent?.type === EventType.BLACK_SWAN;

  return (
    // Use h-[100dvh] to fix mobile browser toolbar covering bottom content
    <div className={`flex flex-col h-screen supports-[height:100dvh]:h-[100dvh] overflow-hidden font-sans ${isBlackSwan ? 'animate-shake' : ''}`}>
      
      {/* Top Section: Header & Event */}
      <Header 
        cash={cash} 
        holdings={holdings} 
        currentPrice={currentPrice} 
        initialCash={INITIAL_CASH} 
      />
      
      {/* Event/Status Bar - Auto Height */}
      <div className="relative z-0 bg-slate-900 border-b border-slate-800 shrink-0 flex flex-col justify-center min-h-[3rem] h-auto transition-all duration-300">
         {activeEvent ? (
           <EventBanner event={activeEvent} />
         ) : (
           <div className="flex items-center justify-center py-2 px-4 text-slate-600 text-xs md:text-sm font-mono tracking-widest uppercase w-full text-center">
             市场平稳 • {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
         )}
      </div>

      {/* Middle Section: Chart */}
      <div className="flex-1 relative bg-slate-950 min-h-0">
        {gameState === GameStatus.IDLE ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4">
             <div className="text-center space-y-4 md:space-y-6">
                <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tighter">
                  极速交易员
                </h1>
                <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto">
                  拥有100万美元初始资金，挑战150秒市场波动，你能否实现财富增值？
                </p>
                <button 
                  onClick={handleStart}
                  className="px-6 py-3 md:px-8 md:py-4 bg-slate-100 hover:bg-white text-slate-900 rounded-full font-bold text-base md:text-lg flex items-center mx-auto gap-2 transition-transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-slate-900" /> 开始交易
                </button>
             </div>
          </div>
        ) : (
          <PriceChart 
            data={priceHistory} 
            trades={trades} 
            currentPrice={currentPrice} 
          />
        )}
      </div>

      {/* Bottom Section: Controls */}
      <Controls 
        cash={cash}
        holdings={holdings}
        currentPrice={currentPrice}
        onBuy={handleBuy}
        onSell={handleSell}
        disabled={gameState !== GameStatus.PLAYING}
      />

      {/* Modals */}
      {gameState === GameStatus.ENDED && (
        <GameOverModal 
          finalNetWorth={cash + (holdings * currentPrice)} 
          initialCash={INITIAL_CASH}
          tradeCount={trades.length}
          onRestart={handleStart}
        />
      )}

    </div>
  );
};

export default App;