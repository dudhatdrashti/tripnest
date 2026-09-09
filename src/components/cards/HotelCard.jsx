import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Share2,
Wifi,
  Waves,
  Coffee,
  Snowflake,
  Dumbbell,
  Utensils,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';
import PriceDisplay from '../ui/PriceDisplay';
import { shareHotel, formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const amenityIcons = {
  wifi: Wifi,
  pool: Waves,
  breakfast: Coffee,
  ac: Snowflake,
  gym: Dumbbell,
  restaurant: Utensils,
  'Free WiFi': Wifi,
  'Private Onsen': Waves,
  'Fine Dining': Utensils,
  'Spa & Wellness': Utensils,
};

export default function HotelCard({ hotel, index = 0 }) {
  const { t } = useTranslation();
  const { isInWishlist, dispatch, currency } = useApp();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(hotel.id)) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: hotel.id });
      toast.success(t('ui.removedWishlist'));
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: hotel.id });
      toast.success(t('ui.addedWishlist'));
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await shareHotel(hotel);
    if (result === 'copied') {
      toast.success(t('ui.linkCopied'));
    }
  };

  const originalPrice = hotel.discount > 0 ? hotel.price / (1 - hotel.discount / 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={`/hotel/${hotel.id}`}
        className="group luxury-card overflow-hidden h-full flex flex-col"
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {hotel.discount > 0 && (
            <Badge variant="danger" size="sm" className="absolute top-3 left-3">
              -{hotel.discount}% OFF
            </Badge>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleWishlist}
              aria-label={
                isInWishlist(hotel.id) ? t('ui.removeFromWishlist') : t('ui.addToWishlist')
              }
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
            >
              <Heart
                className={`w-4 h-4 ${
                  isInWishlist(hotel.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-white'
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              aria-label={t('ui.shareHotel')}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1 text-white/90 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hotel.location.city}, {hotel.location.country}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-primary-500 transition-colors line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {hotel.rating}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {hotel.shortDescription}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenities.slice(0, 4).map((amenity) => {
              const Icon = amenityIcons[amenity];
              if (!Icon) return null;
              return (
                <span
                  key={amenity}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg"
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{amenity}</span>
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="success" size="sm">
              <Check className="w-3 h-3 inline mr-1" />
              Free Cancellation
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({hotel.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through mr-2">
                    {formatPrice(originalPrice, currency)}
                  </span>
                )}
                <PriceDisplay price={hotel.price} />
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
