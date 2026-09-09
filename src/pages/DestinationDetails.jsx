import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import HotelCard from '../components/cards/HotelCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import { SearchResultSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      try {
        const dest = await api.getDestinationById(id);
        setDestination(dest);
        if (dest) {
          const destHotels = await api.getDestinationHotels(id);
          setHotels(destHotels);
        }
      } catch (error) {
        toast.error(t('ui.failedLoad', { item: t('ui.destinationWord') }));
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse h-[300px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />
          <div className="animate-pulse h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <SearchResultSkeleton />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title={t('ui.destinationNotFound')}
          description="The destination you're looking for doesn't exist."
          actionLabel="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Breadcrumb
              items={[{ label: destination.name }]}
            />
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {destination.name}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {destination.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {destination.rating} Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {destination.hotels} Hotels
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(destination.name)}`);
                }}
              >
                {t('ui.viewAllHotels')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">{t('ui.aboutDestination')} {destination.name}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            {destination.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hotels in Destination */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">
              {t('ui.hotelsIn')} {destination.name}
            </h2>
            <span className="text-gray-500">
              {hotels.length} {t('ui.properties')}
            </span>
          </div>

          {hotels.length === 0 ? (
            <EmptyState
              title={t('ui.noHotelsFound')}
              description={t('ui.noHotelsInDestination')}
              actionLabel={t('ui.exploreOtherDestinations')}
              onAction={() => navigate('/')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.id} hotel={hotel} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
