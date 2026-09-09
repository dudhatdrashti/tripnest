import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowUpDown, Building2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../hooks/useDebounce';
import HotelCard from '../components/cards/HotelCard';
import Pagination from '../components/ui/Pagination';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SearchResultSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import FilterSidebar from '../components/common/FilterSidebar';
import { SORT_OPTIONS } from '../constants';
import toast from 'react-hot-toast';

const RESULTS_PER_PAGE = 9;

const initialFilters = {
  minPrice: '',
  maxPrice: '',
  rating: '',
  propertyType: '',
  amenities: [],
  features: [],
  sort: 'recommended',
};

export default function Hotels() {
  const { t } = useTranslation();
  const { dispatch, recentSearches } = useApp();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await api.getHotels({
          search: debouncedQuery,
          ...filters,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        });
        setHotels(results);
        setCurrentPage(1);
      } catch (error) {
        toast.error(t('ui.failedLoad', { item: t('ui.hotelsWord') }));
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, filters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAmenityToggle = useCallback((amenityId) => {
    setFilters((prev) => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities };
    });
  }, []);

  const handleFeatureToggle = useCallback((featureId) => {
    setFilters((prev) => {
      const features = prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId];
      return { ...prev, features };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: query.trim() });
    }
  };

  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    return hotels.slice(start, start + RESULTS_PER_PAGE);
  }, [hotels, currentPage]);

  const totalPages = Math.ceil(hotels.length / RESULTS_PER_PAGE);
  const activeFilterCount =
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.propertyType ? 1 : 0) +
    filters.amenities.length +
    filters.features.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: t('nav.hotels') }]}
            onLight
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('ui.findPerfectStay')}
            </h1>
            <p className="text-lg text-white/80 mb-8">
              {t('ui.browseHotelsDescription')}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ui.searchHotelsCitiesTags')}
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                aria-label={t('ui.searchHotels')}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label={t('ui.clearSearch')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter + sort toggle */}
        <div className="flex lg:hidden justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('search.filters')}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 rounded-xl shadow text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onAmenityToggle={handleAmenityToggle}
                onFeatureToggle={handleFeatureToggle}
                onClear={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 260 }}
                className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto p-6 lg:hidden"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">{t('search.filters')}</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    aria-label={t('ui.closeFilters')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onAmenityToggle={handleAmenityToggle}
                  onFeatureToggle={handleFeatureToggle}
                  onClear={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                  onApply={() => setShowFilters(false)}
                  activeFilterCount={activeFilterCount}
                  showApply
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    Loading hotels...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {hotels.length}
                    </span>{' '}
                    {t('search.results')}
                  </>
                )}
              </p>
              <div className="hidden lg:flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 rounded-xl shadow text-sm border border-gray-100 dark:border-gray-700"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <SearchResultSkeleton />
            ) : hotels.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={t('ui.noHotelsFound')}
                description="Try adjusting your filters or search for a different property."
                actionLabel={t('search.clearFilters')}
                onAction={clearFilters}
              />
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08 } },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {paginatedHotels.map((hotel, index) => (
                    <HotelCard key={hotel.id} hotel={hotel} index={index} />
                  ))}
                </motion.div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
