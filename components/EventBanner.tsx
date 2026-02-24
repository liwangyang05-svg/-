import React from 'react';
import { MarketEvent } from '../types';
import { TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';

interface EventBannerProps {
  event: MarketEvent | null;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event }) => {
  if (!event) return null;

  const IconComponent = () => {
    switch (event.icon) {
      case 'trending-up': return <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-current" />;
      case 'bar-chart-2': return <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-current" />;
      case 'alert-triangle': return <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-current" />;
      case 'shield-alert': return <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-current" />;
      default: return null;
    }
  };

  return (
    <div className={`w-full py-2 px-3 md:py-3 md:px-6 flex items-center justify-center shadow-lg transition-all duration-300 border-y ${event.colorClass}`}>
      <div className="shrink-0 mr-3 self-start mt-1 md:mt-0 md:self-center">
        <IconComponent />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm md:text-lg font-bold uppercase tracking-wider leading-tight break-words">{event.name}</h3>
        <p className="text-xs md:text-sm opacity-90 font-medium leading-normal break-words mt-0.5">{event.description}</p>
      </div>
    </div>
  );
};