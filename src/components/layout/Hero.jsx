import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
Search,
  MapPin,
  Star,
  Play,
  Users,
  Sparkles,
ShieldCheck,
  Building2,
  Globe2,
BadgeCheck,
  Hotel,
  Plane,
  ArrowRight,
Gem,
  Crown,
  CalendarCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import VideoModal from '../modals/VideoModal';

const floatingCards = [
  {
    type: 'bestPrice',
    icon: BadgeCheck,
    title: 'Best Price',
    subtitle: 'Guaranteed',
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/30',
    position: 'left-[3%] top-[16%] hidden xl:flex',
    delay: 1.2,
  },
  {
    type: 'topDestination',
    icon: MapPin,
    title: 'Top Destination',
    subtitle: 'Bali, Indonesia',
    gradient: 'from-primary-400 to-accent-500',
    glow: 'shadow-primary-500/30',
    position: 'right-[4%] top-[14%] hidden lg:flex',
    delay: 1.4,
  },
  {
    type: 'liveBooking',
    icon: CalendarCheck,
    title: 'Live Booking',
    subtitle: '278 today',
    gradient: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-500/30',
    position: 'left-[5%] bottom-[30%] hidden lg:flex',
    delay: 1.6,
  },
  {
    type: 'travelAward',
    icon: Crown,
    title: 'Travel Award',
    subtitle: 'Best Platform 2024',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/30',
    position: 'right-[4%] bottom-[32%] hidden xl:flex',
    delay: 1.8,
  },
  {
    type: 'premiumMember',
    icon: Gem,
    title: 'Premium Member',
    subtitle: '2,400+ Travelers',
    gradient: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/30',
    position: 'right-[22%] top-[8%] hidden 2xl:flex',
    delay: 2.0,
  },
];

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [suggestions, setSuggestions] = useState({ hotels: [], destinations: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [topDestination, setTopDestination] = useState(null);

  const searchRef = useRef(null);
  const guestsRef = useRef(null);

const [travelersCount] = useAnimatedCounter(50000);
  const [hotelsCount] = useAnimatedCounter(500);
  const [destinationsCount] = useAnimatedCounter(190);

  useEffect(() => {
    const load = async () => {
      const dests = await api.getDestinations();
      setTopDestination(dests[0]);
    };
    load();
  }, []);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!destination.trim()) {
        setSuggestions({ hotels: [], destinations: [] });
        setLoadingSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      const data = await api.getSearchSuggestions(destination);
      setSuggestions(data);
      setLoadingSuggestions(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [destination]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target)) setShowGuests(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ESC to close video
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowVideo(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const minCheckout = checkIn || today;

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) {
      params.set('q', destination.trim());
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: destination.trim() });
    }
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const selectSuggestion = (name) => {
    setDestination(name);
    setShowSuggestions(false);
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: name });
  };

  const allSuggestions = [...suggestions.destinations, ...suggestions.hotels];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=70"
          alt=""
          className="w-full h-full object-cover scale-105"
          loading="eager"
          decoding="async"
        />
        {/* Dark overlays to reduce noise — balanced readability, focused center */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/85 to-accent-950/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/60 z-10" />
        <div className="absolute inset-0 bg-slate-950/30 z-10" />
        {/* Center vignette for readability */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.15)_0%,rgba(2,6,23,0.55)_100%)] z-10" />
      </div>

      {/* Subtle aurora gradient lighting — static, no movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="blob blob-primary w-[34rem] h-[34rem] top-[8%] left-[6%]" />
        <div className="blob blob-accent w-[40rem] h-[40rem] bottom-[6%] right-[4%]" />
        <div className="blob blob-gold w-[26rem] h-[26rem] top-[30%] right-[22%]" />
        <div className="blob blob-emerald w-[24rem] h-[24rem] bottom-[24%] left-[30%]" />
      </div>

      {/* Decorative Cards — fixed, stable, only hover interaction */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
        {floatingCards.map((card) => (
          <div
            key={card.type}
            className={`absolute ${card.position} pointer-events-auto`}
          >
            <div className="glass-card dark:glass-card-dark rounded-2xl p-4 shadow-2xl shadow-black/30 flex items-center gap-3 min-w-[200px] hover:scale-[1.04] hover:shadow-primary-500/30 transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 shadow-lg ${card.glow}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-gray-100">{card.title}</p>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

{/* Main Content — stable */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-28 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 glass-card rounded-full text-white text-sm font-medium mb-10 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            {t('hero.badge')}
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-7 leading-[1.1] tracking-tight text-balance"
          >
            {t('hero.headline')}{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-300 to-yellow-400 bg-clip-text text-transparent">
              {t('hero.headlineHighlight')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-white/80 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto"
            ref={searchRef}
          >
            <div className="glass-card dark:glass-card-dark rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl shadow-black/40 relative">
              <div className="flex flex-col md:flex-row items-stretch gap-1 md:gap-2">
                {/* Destination */}
                <div className="flex-1 relative">
                  <div className="flex items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-100/60 dark:hover:bg-gray-800/60 focus-within:bg-slate-100/80 dark:focus-within:bg-gray-800/80 focus-within:ring-2 focus-within:ring-primary-400/40 transition-all duration-300 text-left">
                    <MapPin className="w-5 h-5 text-primary-500 shrink-0 hidden sm:block" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        {t('hero.destination')}
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t('hero.destinationPlaceholder')}
                        className="w-full bg-transparent text-slate-900 dark:text-white text-sm font-medium placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none"
                        aria-label="Destination"
                      />
                    </div>
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-gray-700 overflow-hidden z-40 text-left"
                      >
                        {destination.trim() ? (
                          loadingSuggestions ? (
                            <div className="p-4 text-sm text-slate-500 dark:text-gray-400 flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                              Searching...
                            </div>
                          ) : allSuggestions.length > 0 ? (
                            <div className="py-2 max-h-72 overflow-y-auto">
                              {allSuggestions.map((item, idx) => {
                                const isHotel = !!item.images;
                                return (
                                  <button
                                    key={`${isHotel ? 'h' : 'd'}-${idx}`}
                                    type="button"
                                    onClick={() => selectSuggestion(item.name)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    {isHotel ? (
                                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                                        <Hotel className="w-4 h-4 text-white" />
                                      </div>
                                    ) : (
                                      <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover shrink-0" loading="lazy" />
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200 truncate">{item.name}</p>
                                      <p className="text-xs text-slate-400 flex items-center gap-1">
                                        {isHotel ? (
                                          <>
                                            <Hotel className="w-3 h-3" /> {item.location.city}
                                          </>
                                        ) : (
                                          <>
                                            <Plane className="w-3 h-3" /> {item.country}
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-4 text-sm text-slate-500 dark:text-gray-400">{t('hero.noResults')}</div>
                          )
                        ) : (
                          <div className="p-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                              {t('hero.popularDestinations')}
                            </p>
                            <div className="space-y-1">
                              {[0, 1, 2, 3].map((i) => {
                                const d = topDestination;
                                if (!d) return null;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => selectSuggestion(d.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <img src={d.image} alt={d.name} className="w-8 h-8 rounded-md object-cover" loading="lazy" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{d.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden md:block w-px bg-slate-200/70 dark:bg-gray-700 self-stretch" />

                {/* Check-in */}
                <div className="px-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-100/60 dark:hover:bg-gray-800/60 focus-within:bg-slate-100/80 dark:focus-within:bg-gray-800/80 focus-within:ring-2 focus-within:ring-primary-400/40 transition-all duration-300 text-left">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    {t('hero.checkIn')}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) setCheckOut('');
                    }}
                    className="bg-transparent text-slate-900 dark:text-white text-sm font-medium focus:outline-none"
                    aria-label="Check-in date"
                  />
                </div>

                <div className="hidden md:block w-px bg-slate-200/70 dark:bg-gray-700 self-stretch" />

                {/* Check-out */}
                <div className="px-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-100/60 dark:hover:bg-gray-800/60 focus-within:bg-slate-100/80 dark:focus-within:bg-gray-800/80 focus-within:ring-2 focus-within:ring-primary-400/40 transition-all duration-300 text-left">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    {t('hero.checkOut')}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={minCheckout}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-slate-900 dark:text-white text-sm font-medium focus:outline-none"
                    aria-label="Check-out date"
                  />
                </div>

                <div className="hidden md:block w-px bg-slate-200/70 dark:bg-gray-700 self-stretch" />

                {/* Guests */}
                <div className="relative" ref={guestsRef}>
                  <button
                    type="button"
                    onClick={() => setShowGuests(!showGuests)}
                    className="flex items-center gap-3 px-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-100/60 dark:hover:bg-gray-800/60 focus-visible:bg-slate-100/80 dark:focus-visible:bg-gray-800/80 transition-colors w-full md:w-auto text-left"
                    aria-expanded={showGuests}
                  >
                    <Users className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('hero.guests')}
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {guests} {t('hero.guest')}{guests > 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {showGuests && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 top-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-gray-700 p-4 z-40 w-56"
                      >
                        <div className="flex items-center justify-between gap-6">
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                            {t('hero.guestsLabel')}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setGuests((g) => Math.max(1, g - 1))}
                              className="w-8 h-8 rounded-full border border-slate-300 dark:border-gray-600 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors"
                              aria-label="Decrease guests"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-slate-900 dark:text-white">{guests}</span>
                            <button
                              type="button"
                              onClick={() => setGuests((g) => Math.min(10, g + 1))}
                              className="w-8 h-8 rounded-full border border-slate-300 dark:border-gray-600 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors"
                              aria-label="Increase guests"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn-glow flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg shadow-primary-500/40 hover:shadow-xl hover:shadow-primary-500/50 transition-all shrink-0"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('hero.search')}</span>
                </motion.button>
              </div>
            </div>
          </motion.form>

{/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10"
          >
            <Link
              to="/destinations"
              className="btn-premium group inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl text-[15px] text-white font-semibold"
              aria-label="Explore destinations"
            >
              <MapPin className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              {t('hero.exploreDestinations')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="group inline-flex items-center gap-3.5 px-4 py-2 text-white/90 font-semibold rounded-2xl hover:text-white transition-all nav-btn"
              aria-label="Watch video"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
className="relative w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/40 group-hover:shadow-xl group-hover:shadow-primary-500/60 transition-all ripple btn-glow"
              >
                <Play className="w-5 h-5 text-white" />
              </motion.span>
              <span className="text-sm">{t('hero.watchVideo')}</span>
            </button>
          </motion.div>

          {/* Trust Section — individual glass badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
transition={{ delay: 0.9, duration: 0.6 }}
className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-14"
          >
            <span className="flex items-center gap-2.5 px-4 py-2.5 glass-card dark:glass-card-dark rounded-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </span>
              <span className="font-bold text-white text-sm">4.9</span>
              <span className="text-white/70 text-xs hidden sm:inline">{t('hero.ratingLabel')}</span>
            </span>
<span className="flex items-center gap-2.5 px-4 py-2.5 glass-card dark:glass-card-dark rounded-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
              <Users className="w-4 h-4 text-primary-300" />
              <span className="font-bold text-white text-sm">{travelersCount.toLocaleString()}K+</span>
              <span className="text-white/70 text-xs hidden sm:inline">{t('hero.travelers')}</span>
            </span>
            <span className="flex items-center gap-2.5 px-4 py-2.5 glass-card dark:glass-card-dark rounded-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
              <Building2 className="w-4 h-4 text-primary-300" />
              <span className="font-bold text-white text-sm">{hotelsCount}+</span>
              <span className="text-white/70 text-xs hidden sm:inline">{t('hero.hotels')}</span>
            </span>
            <span className="flex items-center gap-2.5 px-4 py-2.5 glass-card dark:glass-card-dark rounded-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
              <Globe2 className="w-4 h-4 text-primary-300" />
              <span className="font-bold text-white text-sm">{destinationsCount}+</span>
              <span className="text-white/70 text-xs hidden sm:inline">{t('hero.destinations')}</span>
            </span>
            <span className="flex items-center gap-2.5 px-4 py-2.5 glass-card dark:glass-card-dark rounded-2xl hover:scale-105 hover:shadow-primary-500/20 transition-all duration-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-white/70 text-xs">{t('hero.support')}</span>
            </span>
          </motion.div>
</motion.div>
</div>

{/* Video Modal */}
      <VideoModal open={showVideo} onClose={() => setShowVideo(false)} />
    </section>
  );
}
