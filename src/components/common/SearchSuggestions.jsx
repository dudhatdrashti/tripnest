import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Loader2, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SearchSuggestions({
  show,
  loading,
  suggestions,
  recentSearches,
  onSelect,
  onClearRecent,
}) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          role="listbox"
        >
          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
              {t('hero.searching')}
            </div>
          )}

          {/* Recent Searches */}
          {!loading && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('ui.recentSearches')}
                </p>
                <button
                  onClick={onClearRecent}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  {t('ui.clear')}
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                    role="option"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destination Suggestions */}
          {!loading && suggestions?.destinations?.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
                {t('ui.searchDestinations')}
              </p>
              {suggestions.destinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelect(d.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                  role="option"
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-8 h-8 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Hotel Suggestions */}
          {!loading && suggestions?.hotels?.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
                {t('ui.searchHotels')}
              </p>
              {suggestions.hotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onSelect(h.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                  role="option"
                >
                  <img
                    src={h.images[0]}
                    alt={h.name}
                    className="w-8 h-8 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{h.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {h.location.city}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && suggestions?.destinations?.length === 0 && suggestions?.hotels?.length === 0 && (
            <div className="flex flex-col items-center py-8 px-4 text-center">
              <SearchX className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('ui.noSearchResults')}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
