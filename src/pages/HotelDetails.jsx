import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Wifi,
  Dumbbell,
  UtensilsCrossed,
  Wine,
  Sparkles,
  ParkingCircle,
  Snowflake,
  Coffee,
  PawPrint,
  Plane,
  Shirt,
  Check,
  Users,
  Calendar,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import HotelCard from '../components/cards/HotelCard';
import ReviewCard from '../components/cards/ReviewCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import PriceDisplay from '../components/ui/PriceDisplay';
import HotelPriceChart from '../components/charts/HotelPriceChart';
import HotelMap from '../components/maps/HotelMap';
import { DetailPageSkeleton } from '../components/ui/Skeleton';
import { shareHotel, formatDate } from '../utils/helpers';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import toast from 'react-hot-toast';

const amenityIcons = {
  wifi: Wifi,
  pool: undefined,
  spa: Sparkles,
  gym: Dumbbell,
  restaurant: UtensilsCrossed,
  bar: Wine,
  parking: ParkingCircle,
  ac: Snowflake,
  breakfast: Coffee,
  pets: PawPrint,
  airport: Plane,
  laundry: Shirt,
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch, isInWishlist, currency } = useApp();

  const [hotel, setHotel] = useState(null);
  const [similarHotels, setSimilarHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const data = await api.getHotelById(id);
        setHotel(data);
        if (data) {
          dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: data.id });
          if (data.rooms.length > 0) setSelectedRoom(data.rooms[0]);
          const similar = await api.getSimilarHotels(id);
          setSimilarHotels(similar);
        }
      } catch (error) {
        toast.error('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
          <Link to="/" className="text-primary-500 hover:text-primary-600">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleWishlist = () => {
    if (isInWishlist(hotel.id)) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: hotel.id });
      toast.success('Removed from wishlist');
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: hotel.id });
      toast.success('Added to wishlist');
    }
  };

  const handleShare = async () => {
    const result = await shareHotel(hotel);
    if (result === 'copied') toast.success('Link copied to clipboard!');
  };

  const handleBookNow = () => {
    navigate(`/booking/${hotel.id}`, {
      state: {
        hotel,
        room: selectedRoom,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  const overviewTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">{t('hotel.overview')}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{hotel.description}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">{t('hotel.amenities')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {hotel.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity];
            return (
              <div key={amenity} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                {Icon && <Icon className="w-5 h-5 text-primary-500" />}
                <span className="text-sm capitalize">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">{t('hotel.policies')}</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Check-in</span>
              <span className="font-medium">{hotel.policies.checkIn}</span>
            </p>
            <p className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500">Check-out</span>
              <span className="font-medium">{hotel.policies.checkOut}</span>
            </p>
            <p className="py-2 text-gray-500">
              <span className="font-medium text-gray-900 dark:text-white inline-block mb-1">Cancellation:</span>
              <br />
              {hotel.policies.cancellation}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Price Trend</h3>
          <HotelPriceChart hotel={hotel} />
        </div>
      </div>
    </div>
  );

  const reviewsTab = (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold text-primary-500">{hotel.rating}</div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(hotel.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Based on {hotel.reviews.toLocaleString()} reviews
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotel.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );

  const locationTab = (
    <div className="space-y-6">
      <HotelMap hotel={hotel} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">{t('hotel.nearbyAttractions')}</h3>
          <div className="space-y-3">
            {hotel.nearbyAttractions.map((attraction) => (
              <div key={attraction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium">{attraction.name}</p>
                  <p className="text-sm text-gray-500">{attraction.type}</p>
                </div>
                <span className="text-sm text-primary-500">{attraction.distance}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Nearby Restaurants</h3>
          <div className="space-y-3">
            {hotel.nearbyRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                </div>
                <span className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: t('hotel.overview'), content: overviewTab },
    { label: t('hotel.reviews'), content: reviewsTab },
    { label: t('hotel.location'), content: locationTab },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Image Gallery */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Search', path: '/search' },
              { label: hotel.location.city },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl">
              <Swiper
                modules={[Navigation, Pagination, Thumbs, FreeMode]}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                className="main-swiper h-[400px] lg:h-[500px]"
              >
                {hotel.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${hotel.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {hotel.discount > 0 && (
                <Badge variant="danger" size="md" className="absolute top-4 left-4 z-10">
                  Save {hotel.discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="hidden lg:block">
              <Swiper
                modules={[Thumbs, FreeMode]}
                onSwiper={setThumbsSwiper}
                direction="vertical"
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                className="h-[500px]"
              >
                {hotel.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                        activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-60'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-28 object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlist}
                    className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition-all"
                    title="Toggle wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist(hotel.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-500 dark:text-gray-300'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition-all"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-primary-700 dark:text-primary-300">
                    {hotel.rating}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {hotel.reviews.toLocaleString()} reviews
                </span>
                <Badge variant="primary">{hotel.location.city}</Badge>
                <Badge>{hotel.propertyType}</Badge>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
              <Tabs tabs={tabs} />
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow sticky top-24">
              <PriceDisplay price={selectedRoom?.price || hotel.price} className="mb-4" />

              {/* Room Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Room</label>
                <div className="space-y-2">
                  {hotel.rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{room.type}</span>
                        <PriceDisplay price={room.price} showPerNight={false} className="text-base" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{room.beds} · {room.capacity} guests</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Guests</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(6, guests + 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleBookNow}
              >
                {t('hotel.bookNow')}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Free cancellation on most rooms
              </p>
            </div>
          </div>
        </div>

        {/* Similar Hotels */}
        {similarHotels.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold gradient-text">{t('hotel.similarHotels')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarHotels.map((h, index) => (
                <HotelCard key={h.id} hotel={h} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
