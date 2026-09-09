import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import HotelCard from '../components/cards/HotelCard';
import EmptyState from '../components/ui/EmptyState';
import { HotelCardSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { t } = useTranslation();
  const { wishlist, dispatch } = useApp();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistHotels = async () => {
      setLoading(true);
      try {
        const allHotels = await api.getHotels();
        const filtered = allHotels.filter((h) => wishlist.includes(h.id));
        setHotels(filtered);
      } catch (error) {
        toast.error(t('ui.failedLoad', { item: t('ui.wishlistWord') }));
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistHotels();
  }, [wishlist]);

  const handleRemove = (hotelId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: hotelId });
    toast.success(t('ui.removedWishlist'));
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.success(t('ui.wishlistCleared'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{t('wishlist.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {hotels.length} {t(hotels.length === 1 ? 'ui.hotel' : 'ui.hotels')}
            </p>
          </div>
          {hotels.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('ui.clearAll')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={t('wishlist.empty')}
            description={t('wishlist.emptyDescription')}
            actionLabel={t('wishlist.exploreNow')}
            onAction={() => (window.location.href = '/')}
          />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {hotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <HotelCard hotel={hotel} index={index} />
                  <button
                    onClick={() => handleRemove(hotel.id)}
                    className="absolute bottom-4 right-4 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
