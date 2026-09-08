import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Loader2,
  ArrowRight,
  Plane,
  Hotel,
  SearchX,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';

export default function HeroSearchModal({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch, recentSearches } = useApp();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ hotels: [], destinations: [] });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [trendingHotels, setTrendingHotels] = useState([]);

  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSuggestions({ hotels: [], destinations: [] });
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Load popular destinations & trending hotels
  useEffect(() => {
    if (open) {
      api.getDestinations().then((d) => setPopularDestinations(d.slice(0, 6)));
      api.getPopularHotels().then((h) => setTrendingHotels(h.slice(0, 4)));
    }
  }, [open]);

  // Debounced suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions({ hotels: [], destinations: [] });
        setActiveIndex(-1);
        return;
      }
      setLoading(true);
      try {
        const data = await api.getSearchSuggestions(debouncedQuery);
        setSuggestions(data);
        setActiveIndex(-1);
      } catch {
        setSuggestions({ hotels: [], destinations: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;

      const totalItems =
        suggestions.destinations.length + suggestions.hotels.length;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < totalItems) {
          const all = [...suggestions.destinations, ...suggestions.hotels];
          const selected = all[activeIndex];
          selectResult(selected.name || selected);
        } else if (query.trim()) {
          submitSearch();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, suggestions, activeIndex, query]
  );

  const submitSearch = () => {
    const value = query.trim();
    if (value) {
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: value });
      navigate(`/search?q=${encodeURIComponent(value)}`);
      onClose();
    }
  };

  const selectResult = (value) => {
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: value });
    navigate(`/search?q=${encodeURIComponent(value)}`);
    onClose();
  };

  const clearRecent = () => {
    dispatch({ type: 'CLEAR_RECENT_SEARCHES' });
  };

  const allSuggestions = [...suggestions.destinations, ...suggestions.hotels];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[8vh] sm:pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-900/30 border border-white/40 dark:border-gray-700/50 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-primary-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('hero.searchDestination')}
                className="flex-1 bg-transparent text-gray-800 dark:text-white text-base sm:text-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                aria-label="Search destinations or hotels"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSuggestions({ hotels: [], destinations: [] });
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-3 px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  Searching...
                </div>
              )}

              {/* Recent Searches */}
              {!loading && !query.trim() && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t('hero.recentSearches')}
                    </p>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      {t('hero.clearRecent')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {recentSearches.slice(0, 6).map((search, i) => (
                      <button
                        key={i}
                        onClick={() => selectResult(search)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-left transition-colors group"
                        role="option"
                        aria-selected={activeIndex === i}
                      >
                        <Clock className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Destinations */}
              {!loading && !query.trim() && popularDestinations.length > 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 mb-2">
                    {t('hero.popularDestinations')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {popularDestinations.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => selectResult(d.name)}
                        className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                      >
                        <img
                          src={d.image}
                          alt={d.name}
                          className="w-9 h-9 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {d.name}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {d.country}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Hotels */}
              {!loading && !query.trim() && trendingHotels.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 mb-2">
                    {t('hero.trendingHotels')}
                  </p>
                  <div className="space-y-1">
                    {trendingHotels.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => selectResult(h.name)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                          <Hotel className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {h.name}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {h.location.city}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-amber-500 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400" /> {h.rating}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Suggestions */}
              {!loading && query.trim() && (
                <div className="p-4">
                  {allSuggestions.length > 0 ? (
                    <div className="space-y-1">
                      {allSuggestions.map((item, idx) => {
                        const isHotel = !!item.images;
                        return (
                          <button
                            key={`${isHotel ? 'h' : 'd'}-${item.id}`}
                            onClick={() => selectResult(item.name)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                              activeIndex === idx
                                ? 'bg-primary-50 dark:bg-primary-900/30'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            role="option"
                            aria-selected={activeIndex === idx}
                          >
                            {isHotel ? (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                                <Hotel className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                {isHotel ? (
                                  <>
                                    <MapPin className="w-3 h-3" /> {item.location.city}
                                  </>
                                ) : (
                                  <>
                                    <Plane className="w-3 h-3" /> {item.country}
                                  </>
                                )}
                              </p>
                            </div>
                            <ArrowRight
                              className={`w-4 h-4 shrink-0 ${
                                activeIndex === idx
                                  ? 'text-primary-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-10 text-center">
                      <SearchX className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t('hero.noResults')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{t('hero.noResultsDesc')}</p>
                      <button
                        onClick={submitSearch}
                        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                      >
                        Search "{query}"
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Keyboard hint */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">
                    Enter
                  </kbd>
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">
                    Esc
                  </kbd>
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
