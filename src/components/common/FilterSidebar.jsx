import React from 'react';
import { motion } from 'framer-motion';
import {
Star,
  X,
  Wifi,
  Waves,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Wine,
  ParkingCircle,
  Snowflake,
  Coffee,
  PawPrint,
  Plane,
  Shirt,
  ShieldCheck,
  Users,
  SlidersHorizontal,
} from 'lucide-react';
import { AMENITIES_LIST, PROPERTY_TYPES, RATING_FILTERS, PROPERTY_FEATURES } from '../../constants';
import Button from '../ui/Button';

const amenityIcons = {
  Wifi,
  Waves,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Wine,
  ParkingCircle,
  Snowflake,
  Coffee,
  PawPrint,
  Plane,
  Shirt,
};

const featureIcons = {
  ShieldCheck,
  Coffee,
  Waves,
  ParkingCircle,
  Wifi,
  Snowflake,
  Users,
  PawPrint,
};

export default function FilterSidebar({
  filters,
  onFilterChange,
  onAmenityToggle,
  onFeatureToggle,
  onClear,
  onApply,
  activeFilterCount,
  showApply = false,
}) {
  const handlePriceChange = (e) => {
    const value = e.target.value;
    const maxPrice = value === '0' ? '' : value;
    onFilterChange('maxPrice', maxPrice);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-500" />
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {filters.maxPrice ? `Max $${filters.maxPrice}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1200"
          step="50"
          value={filters.maxPrice || 0}
          onChange={handlePriceChange}
          className="w-full accent-primary-500"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span>
          <span>$1200</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Star Rating
        </label>
        <div className="space-y-2">
          {RATING_FILTERS.map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r.value)}
                onChange={() => onFilterChange('rating', String(r.value))}
                className="accent-primary-500 w-4 h-4"
              />
              <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className={`w-4 h-4 ${r.value <= 4.5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                <span className="ml-1">{r.label}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Property Type
        </label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((pt) => (
            <button
              key={pt.value}
              onClick={() =>
                onFilterChange('propertyType', filters.propertyType === pt.value ? '' : pt.value)
              }
              className={`px-3 py-1.5 rounded-xl text-sm transition-all duration-200 ${
                filters.propertyType === pt.value
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Popular Features
        </label>
        <div className="space-y-2">
          {PROPERTY_FEATURES.map((feature) => {
            const Icon = featureIcons[feature.icon];
            const isActive = filters.features?.includes(feature.id);
            return (
              <button
                key={feature.id}
                onClick={() => onFeatureToggle(feature.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{feature.label}</span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES_LIST.map((amenity) => {
            if (['wifi', 'pool', 'ac', 'breakfast', 'parking', 'pets'].includes(amenity.id)) return null;
            const Icon = amenityIcons[amenity.icon];
            const isActive = filters.amenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                onClick={() => onAmenityToggle(amenity.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span className="truncate">{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply / Reset */}
      {showApply && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <Button variant="primary" fullWidth onClick={onApply}>
            Apply Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button variant="outline" fullWidth onClick={onClear}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
