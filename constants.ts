import { EventType, MarketEvent } from './types';

export const INITIAL_CASH = 1000000;
export const INITIAL_PRICE = 100;
export const GAME_DURATION_SECONDS = 150; // 2m 30s
export const TICK_RATE_MS = 200; // 0.2s
export const TICKS_PER_SECOND = 1000 / TICK_RATE_MS;
export const TOTAL_TICKS = GAME_DURATION_SECONDS * TICKS_PER_SECOND;

// GBM Parameters - Scaled for 0.2s ticks (approx 0.4x drift, 0.63x vol of 0.5s)
export const BASE_VOLATILITY = 0.0126; 
export const BASE_DRIFT = 0.0004;

export const EVENTS: Record<EventType, MarketEvent> = {
  [EventType.RATE_CUT]: {
    id: 'rate_cut',
    type: EventType.RATE_CUT,
    name: '美联储降息',
    description: '流动性注入！市场看涨动能强劲。',
    duration: 50, // 10 seconds
    driftModifier: 0.008,
    volatilityModifier: 1.0,
    colorClass: 'bg-green-500/20 border-green-500 text-green-400',
    icon: 'trending-up'
  },
  [EventType.BLACK_SWAN]: {
    id: 'black_swan',
    type: EventType.BLACK_SWAN,
    name: '黑天鹅事件',
    description: '市场崩盘！极度恐慌与波动。',
    duration: 75, // 15 seconds
    driftModifier: -0.004,
    volatilityModifier: 3.0,
    colorClass: 'bg-red-600/30 border-red-600 text-red-500 animate-pulse',
    icon: 'alert-triangle'
  },
  [EventType.EARNINGS_BEAT]: {
    id: 'earnings_beat',
    type: EventType.EARNINGS_BEAT,
    name: '财报超预期',
    description: '企业利润超出预期，股价稳步攀升。',
    duration: 40, // 8 seconds
    driftModifier: 0.006,
    volatilityModifier: 0.8, // More stable rise
    colorClass: 'bg-blue-500/20 border-blue-500 text-blue-400',
    icon: 'bar-chart-2'
  },
  [EventType.REG_CRACKDOWN]: {
    id: 'reg_crackdown',
    type: EventType.REG_CRACKDOWN,
    name: '监管风暴',
    description: '政策不确定性增加，市场抛压沉重。',
    duration: 60, // 12 seconds
    driftModifier: -0.006,
    volatilityModifier: 1.2,
    colorClass: 'bg-orange-500/20 border-orange-500 text-orange-400',
    icon: 'shield-alert'
  },
  [EventType.NONE]: {
    id: 'none',
    type: EventType.NONE,
    name: '',
    description: '',
    duration: 0,
    driftModifier: 0,
    volatilityModifier: 0,
    colorClass: '',
    icon: ''
  }
};