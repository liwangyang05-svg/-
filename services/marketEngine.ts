import { BASE_DRIFT, BASE_VOLATILITY } from '../constants';
import { MarketEvent } from '../types';

/**
 * Calculates the next price using a simplified Geometric Brownian Motion model
 * adjusted for game feel.
 */
export const calculateNextPrice = (
  currentPrice: number,
  activeEvent: MarketEvent | null
): number => {
  let drift = BASE_DRIFT;
  let volatility = BASE_VOLATILITY;

  if (activeEvent) {
    drift += activeEvent.driftModifier;
    volatility *= activeEvent.volatilityModifier;
  }

  // Random walk component (Standard Normal Distribution approximation)
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  const percentChange = drift + (volatility * z);
  let newPrice = currentPrice * (1 + percentChange);

  // Prevent price from hitting 0 or becoming negative
  // User requested minimum price of 20
  return Math.max(20, newPrice);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
};