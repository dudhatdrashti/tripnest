  import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import {
  ArrowRight,
  Sparkles,
  Umbrella,
  Mountain,
Building2,
  Home as HomeIcon,
  Gem,
  Landmark,
} from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import HotelCard from '../components/cards/HotelCard';
import DestinationCard from '../components/cards/DestinationCard';
import TestimonialCard from '../components/cards/TestimonialCard';
import OfferCard from '../components/cards/OfferCard';
import Hero from '../components/layout/Hero';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import toast from 'react-hot-toast';

// Map category icon names from data to lucide components
const categoryIcons = {
  Umbrella,
  Mountain,
  Building2,
  Home: HomeIcon,
  Gem,
  Landmark,
};

// Premium property count labels per category
const countLabels = {
  'Beach Resorts': 'Luxury Properties',
  'Mountain Retreats': 'Exclusive Stays',
  'City Hotels': 'Premium Hotels',
  'Luxury Villas': 'Private Villas',
  'Boutique Stays': 'Curated Stays',
  'Heritage Hotels': 'Heritage Palaces',
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [popularHotels, setPopularHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [travelersCount, travelersRef] = useAnimatedCounter(500000);
  const [hotelsCount, hotelsRef] = useAnimatedCounter(15000);
  const [destinationsCount, destinationsRef] = useAnimatedCounter(195);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popular, dests, testimonialsData, offersData, cats] = await Promise.all([
          api.getPopularHotels(),
          api.getDestinations(),
          api.getTestimonials(),
          api.getSpecialOffers(),
          api.getCategories(),
        ]);
        setPopularHotels(popular);
        setDestinations(dests);
        setTestimonials(testimonialsData);
        setOffers(offersData);
        setCategories(cats);
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

{/* Categories */}
      <section className="relative py-24 sm:py-28 overflow-hidden bg-gray-50 dark:bg-gray-800/50">
        {/* Premium background glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
            className="text-center mb-[88px]"
          >
            {/* Premium badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 mb-6 border border-primary-200/60 dark:border-primary-900/60"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              Curated Categories
            </motion.span>

            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 bg-clip-text text-transparent">
                Find Your Perfect Stay
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Explore hand-picked accommodation categories designed for every travel style and experience.
            </p>
          </motion.div>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
            {categories.map((cat, index) => {
              const Icon = categoryIcons[cat.icon] || Building2;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="group relative overflow-hidden rounded-3xl h-[280px] sm:h-[300px] cursor-pointer will-change-transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/20 dark:hover:shadow-black/40"
                  onClick={() => navigate('/destinations')}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/destinations');
                    }
                  }}
                >
{/* Image — always visible, subtle zoom + brightness lift on hover */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.05] group-hover:contrast-[1.1]"
                  />
                  {/* Dark luxury overlay — black gradient, deepens on hover, keeps image visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* Floating glass icon badge */}
                  <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full glass-card dark:glass-card-dark flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/30 dark:ring-white/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                    <h3 className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow-sm">
                      {cat.name}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm mt-1 font-light">
                      {cat.count}+ {countLabels[cat.name] || 'Properties'}
                    </p>
                    {/* Hover CTA — smooth fade-up reveal */}
                    <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Explore Category
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

{/* Popular Destinations */}
      <section
        className="py-24 sm:py-28 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f7ff 50%, #ffffff 100%)',
        }}
      >
        {/* Premium ambient glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-80 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-14 text-center lg:text-left"
          >
            <div>
              {/* Most Loved Destinations badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 mb-5 border border-primary-200/60 dark:border-primary-900/60"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Most Loved Destinations
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 bg-clip-text text-transparent">
                  Explore The World's Finest Destinations
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 text-base md:text-lg">
                Discover handpicked locations loved by thousands of travelers worldwide.
              </p>
            </div>

            {/* Premium View All button */}
            <Link
              to="/search"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-accent-500/40 hover:-translate-y-0.5 active:scale-95 transition-all btn-glow shrink-0"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 8).map((dest, index) => (
              <DestinationCard key={dest.id} destination={dest} index={index} />
            ))}
          </div>

          {/* Stats strip below the grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
          >
            {[
              { value: '50+', label: 'Destinations' },
              { value: '10K+', label: 'Travelers' },
              { value: '4.9', label: 'Average Rating' },
            ].map((statItem, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {statItem.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{statItem.label}</span>
                {idx < 2 && (
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 ml-2.5" aria-hidden="true" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Hotels */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{t('home.trendingHotels')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Most booked hotels this month
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{popularHotels.slice(0, 8).map((hotel, index) => (
              <HotelCard key={hotel.id} hotel={hotel} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{t('home.specialOffers')}</h2>
            <p className="text-gray-600 dark:text-gray-400">Exclusive deals just for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{offers.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{t('home.testimonials')}</h2>
            <p className="text-gray-600 dark:text-gray-400">Real stories from real travelers</p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              ref={travelersRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{travelersCount.toLocaleString()}+</div>
              <p className="text-white/80">Happy Travelers</p>
            </motion.div>
            <motion.div
              ref={hotelsRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{hotelsCount.toLocaleString()}+</div>
              <p className="text-white/80">Hotels Worldwide</p>
            </motion.div>
            <motion.div
              ref={destinationsRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{destinationsCount}</div>
              <p className="text-white/80">Destinations</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
<div className="text-5xl md:text-6xl font-bold mb-2">10+</div>
              <p className="text-white/80">Years Excellence</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('home.newsletter')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{t('home.newsletterText')}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center sm:text-left"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all active:scale-95"
              >
                {t('home.subscribe')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
