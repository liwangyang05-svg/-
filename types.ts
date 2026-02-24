export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
}

export enum EventType {
  RATE_CUT = 'RATE_CUT',
  BLACK_SWAN = 'BLACK_SWAN',
  EARNINGS_BEAT = 'EARNINGS_BEAT',
  REG_CRACKDOWN = 'REG_CRACKDOWN',
  NONE = 'NONE'
}

export interface MarketEvent {
  id: string;
  type: EventType;
  name: string;
  description: string;
  duration: number; // in ticks (0.5s per tick)
  driftModifier: number;
  volatilityModifier: number;
  colorClass: string;
  icon: string;
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number; // Amount of cash used or gained
  quantity: number; // Number of shares
  timestamp: number; // Game tick index
}

export interface PricePoint {
  tick: number;
  price: number;
  event?: EventType;
}

export interface GameState {
  status: GameStatus;
  cash: number;
  holdings: number;
  currentPrice: number;
  history: PricePoint[];
  trades: Trade[];
  timeLeft: number; // seconds
  activeEvent: MarketEvent | null;
  eventTimeLeft: number; // ticks
  initialPrice: number;
}