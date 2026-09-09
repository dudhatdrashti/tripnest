import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Globe, Compass, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import DestinationCard from '../components/cards/DestinationCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SearchResultSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function Destinations() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        toast.error(t('ui.failedLoad', { item: t('ui.destinationsWord') }));
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return destinations;
    const q = query.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [destinations, query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: t('nav.destinations') }]}
            onLight
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('ui.exploreAllDestinations')}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {t('ui.destinationsDescription')}
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ui.searchDestinationsCountriesTags')}
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                aria-label={t('ui.searchDestinations')}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">{destinations.length}</div>
              <div className="text-sm text-gray-500">{t('ui.destinations')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {destinations.reduce((acc, d) => acc + d.hotels, 0)}
              </div>
              <div className="text-sm text-gray-500">{t('nav.hotels')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {destinations.reduce((acc, d) => acc + d.tags.length, 0)}
              </div>
              <div className="text-sm text-gray-500">{t('ui.experiences')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {destinations.filter((d) => d.rating >= 4.5).length}
              </div>
              <div className="text-sm text-gray-500">{t('ui.topRated')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{loading ? (
            <SearchResultSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title={t('ui.noDestinationsFound')}
              description={t('ui.adjustSearch')}
              actionLabel={t('ui.clearSearch')}
              onAction={() => setQuery('')}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold gradient-text">
                  {filtered.length} {filtered.length === 1 ? t('ui.destinationSingular') : t('ui.destinationPlural')}
                </h2>
                <p className="text-gray-500 text-sm hidden sm:block">
                  {query ? t('ui.resultsFor', { query }) : t('ui.allDestinations')}
                </p>
              </div>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filtered.map((destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    index={index}
                  />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
