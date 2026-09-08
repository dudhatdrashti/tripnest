import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/helpers';

export default function PriceDisplay({ price, currency, showPerNight = true, className = '' }) {
  const { currency: appCurrency } = useApp();
  const displayCurrency = currency || appCurrency;

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatPrice(price, displayCurrency)}
      </span>
      {showPerNight && (
        <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
      )}
    </div>
  );
}
