import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  Bell,
  Moon,
  Sun,
  User,
  Menu,
  X,
  Globe,
  LogOut,
  Settings,
  BookOpen,
  Compass,
  Home,
  MapPin,
  Building2,
  Tag,
  Info,
  Mail,
  ChevronDown,
  Umbrella,
  BedDouble,
  Sparkles,
  Hotel,
  LayoutGrid,
  Plane,
  ShieldCheck,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { CURRENCIES } from '../../constants';
import HeroSearchModal from '../modals/HeroSearchModal';

const navLinks = [
  { path: '/', label: 'nav.home', icon: Home, exact: true },
  { path: '/destinations', label: 'nav.destinations', icon: MapPin, dropdown: 'destinations' },
  { path: '/hotels', label: 'nav.hotels', icon: Building2, dropdown: 'hotels' },
  { path: '/deals', label: 'nav.deals', icon: Tag },
  { path: '/about', label: 'nav.about', icon: Info },
  { path: '/contact', label: 'nav.contact', icon: Mail },
];

const destinationsDropdown = [
  { label: 'Popular Destinations', desc: 'Explore top picks', icon: Umbrella, to: '/destinations' },
  { label: 'Beach Escapes', desc: 'Tropical paradises', icon: Umbrella, to: '/destinations' },
  { label: 'Mountain Retreats', desc: 'High-altitude wonders', icon: MapPin, to: '/destinations' },
  { label: 'City Breaks', desc: 'Urban adventures', icon: Building2, to: '/destinations' },
];

const hotelsDropdown = [
  { label: 'All Hotels', desc: 'Browse our collection', icon: Hotel, to: '/hotels' },
  { label: 'Luxury Resorts', desc: 'Five-star indulgence', icon: Sparkles, to: '/hotels' },
  { label: 'Boutique Hotels', desc: 'Unique stays', icon: BedDouble, to: '/hotels' },
  { label: 'Vacation Villas', desc: 'Private getaways', icon: Umbrella, to: '/hotels' },
];

const profileDropdown = [
  { label: 'nav.profile', icon: User, to: '/profile' },
  { label: 'nav.myBookings', icon: BookOpen, to: '/bookings' },
  { label: 'nav.wishlist', icon: Heart, to: '/wishlist' },
  { label: 'nav.settings', icon: Settings, to: '/profile' },
];

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const {
    darkMode,
    dispatch,
    wishlist,
    unreadNotifications,
    language,
    currency,
    isAuthenticated,
    user,
    logout,
  } = useApp();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const langRef = useRef(null);
  const currencyRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setShowCurrencyMenu(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowLangMenu(false);
    setShowCurrencyMenu(false);
  }, [location.pathname]);

  // Handle ESC to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSearchModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch({ type: 'SET_LANGUAGE', payload: lng });
    setShowLangMenu(false);
    setMobileMenuOpen(false);
  };

  const changeCurrency = (cur) => {
    dispatch({ type: 'SET_CURRENCY', payload: cur });
    setShowCurrencyMenu(false);
    setMobileMenuOpen(false);
  };

  // Exact active route matching — only current page highlights
  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path;
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const DropdownMenu = ({ items, onItemClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute left-0 top-full mt-3 w-72 overflow-hidden rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 py-2"
    >
      {items.map((item, idx) => (
        <Link
          key={idx}
          to={item.to}
          onClick={onItemClick}
          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
            <item.icon className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {t(item.label)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
          </div>
        </Link>
      ))}
    </motion.div>
  );

  const NotificationDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      role="menu"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-primary-500" />
          {t('nav.notifications')}
        </span>
        <button
          onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
          className="text-xs text-primary-500 hover:text-primary-600 font-medium"
        >
          Mark all read
        </button>
      </div>
      <div className="p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          You're all caught up!
        </p>
        <p className="text-xs text-gray-400 mt-1">New notifications will appear here</p>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'navbar-glass dark:navbar-glass-dark shadow-lg shadow-gray-900/10 dark:shadow-black/40'
            : 'bg-gradient-to-b from-slate-950/60 to-transparent backdrop-blur-[2px]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
{/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 shrink-0 group nav-link"
              aria-label="TripNest Home"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/50 group-hover:ring-2 group-hover:ring-white/40 transition-all duration-300"
              >
                <Compass className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                <span className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40 -z-10" />
              </motion.div>
              <div className="leading-none flex flex-col justify-center">
                <span className="block text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent tracking-tight">
                  TripNest
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-400 mt-1.5">
                  Travel Beyond
                </span>
              </div>
            </Link>

            {/* Desktop Centered Nav */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2"
              aria-label="Main navigation"
              ref={dropdownRef}
            >
              {navLinks.map((link) => {
                const active = isActive(link);
                const Icon = link.icon;
                const hasDropdown = !!link.dropdown;
                return (
                  <div key={link.path} className="relative">
                    {hasDropdown ? (
                      <>
<button
                          onClick={() => toggleDropdown(link.dropdown)}
                          className={`relative px-3.5 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 nav-link ${
                            active
                              ? 'text-primary-600 dark:text-primary-400'
                              : scrolled
                              ? 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/60'
                              : 'text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-primary-400 hover:bg-white/10'
                          }`}
                          aria-expanded={openDropdown === link.dropdown}
                        >
                          <Icon className="w-4 h-4" />
                          {t(link.label)}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              openDropdown === link.dropdown ? 'rotate-180' : ''
                            }`}
                          />
                          <span
                            className={`absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ${
                              active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.dropdown && (
                            <DropdownMenu
                              items={
                                link.dropdown === 'destinations'
                                  ? destinationsDropdown
                                  : hotelsDropdown
                              }
                              onItemClick={() => setOpenDropdown(null)}
                            />
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        className={`relative px-3.5 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group nav-link ${
                          active
                            ? 'text-primary-600 dark:text-primary-400'
                            : scrolled
                            ? 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/60'
                            : 'text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-primary-400 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t(link.label)}
                        <span
                          className={`absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 origin-left ${
                            active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-50'
                          }`}
                        />
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-1 lg:gap-2 shrink-0">
              {/* Search Icon (opens modal) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchModalOpen(true)}
                className={`p-2 rounded-xl transition-all duration-200 nav-btn ${scrolled ? 'hover:bg-gray-100/80 dark:hover:bg-gray-800/70' : 'hover:bg-white/10'}`}
                aria-label="Open search"
              >
                <Search className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
              </motion.button>

{/* Language Selector */}
              <div ref={langRef} className="relative hidden lg:block">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-2 rounded-xl transition-all duration-200 nav-btn flex items-center gap-1.5 ${scrolled ? 'hover:bg-gray-100/80 dark:hover:bg-gray-800/70' : 'hover:bg-white/10'}`}
                  aria-label="Change language"
                  aria-expanded={showLangMenu}
                >
                  <Globe className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    {language}
                  </span>
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                      role="menu"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                            language === lang.code
                              ? 'text-primary-500 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span>{lang.native}</span>
                          <span className="text-xs text-gray-400">{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Selector */}
              <div ref={currencyRef} className="relative hidden lg:block">
                <button
                  onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                  className={`p-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-1.5 nav-btn ${scrolled ? 'hover:bg-gray-100/80 dark:hover:bg-gray-800/70' : 'hover:bg-white/10'}`}
                  aria-label="Change currency"
                  aria-expanded={showCurrencyMenu}
                >
                  <span className="text-primary-500 font-semibold">
                    {CURRENCIES[currency]?.symbol}
                  </span>
                  <span className={scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}>
                    {currency}
                  </span>
                </button>
                <AnimatePresence>
                  {showCurrencyMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                      role="menu"
                    >
                      {Object.entries(CURRENCIES).map(([code, cur]) => (
                        <button
                          key={code}
                          onClick={() => changeCurrency(code)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            currency === code
                              ? 'text-primary-500 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {cur.symbol} {code} - {cur.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`p-2 rounded-xl transition-all duration-200 nav-btn ${scrolled ? 'hover:bg-gray-100/80 dark:hover:bg-gray-800/70' : 'hover:bg-white/10'}`}
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-[18px] h-[18px] text-yellow-500" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600' : 'text-gray-700'}`} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/wishlist"
                  className={`relative p-2 rounded-xl transition-colors inline-flex ${scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'}`}
                  aria-label="Wishlist"
                >
<Heart className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Notifications */}
              <div ref={notifRef} className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'}`}
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
                >
<Bell className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold"
                    >
                      {unreadNotifications}
                    </motion.span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && <NotificationDropdown />}
                </AnimatePresence>
              </div>

              {/* Auth: Login/Register OR Profile */}
              {isAuthenticated ? (
                <div ref={profileRef} className="relative hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl transition-colors"
                    aria-label="Profile menu"
                    aria-expanded={showProfileMenu}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-primary-500/20 ring-2 ring-white/40 dark:ring-white/10">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 hidden md:block ${
                        showProfileMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 overflow-hidden"
                        role="menu"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {user?.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                        </div>
                        {profileDropdown.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.to}
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            {t(item.label)}
                          </Link>
                        ))}
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      scrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-700 dark:text-gray-300 hover:text-white'
                    }`}
                  >
                    {t('auth.login')}
                  </Link>
<Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl btn-glow ripple hover:scale-105 active:scale-95 transition-all"
                  >
                    {t('auth.register')}
                  </Link>
                </div>
              )}

{/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-200 nav-btn ${scrolled ? 'hover:bg-gray-100/80 dark:hover:bg-gray-800/70' : 'hover:bg-white/10'}`}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                ) : (
                  <Menu className={`w-[18px] h-[18px] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu / Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 pt-24 space-y-6 overflow-y-auto h-full">
              {/* Search CTA */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25"
              >
                <Search className="w-5 h-5" />
                {t('hero.searchDestination')}
              </button>

              {/* Nav Links */}
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const active = isActive(link);
                  const Icon = link.icon;
                  const hasDropdown = !!link.dropdown;
                  return hasDropdown ? (
                    <div key={link.path}>
                      <button
                        onClick={() =>
                          setMobileDropdown((prev) =>
                            prev === link.dropdown ? null : link.dropdown
                          )
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                          active
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          {t(link.label)}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileDropdown === link.dropdown ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDropdown === link.dropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            {(link.dropdown === 'destinations'
                              ? destinationsDropdown
                              : hotelsDropdown
                            ).map((item, idx) => (
                              <Link
                                key={idx}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <item.icon className="w-4 h-4" />
                                {t(item.label)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {t(link.label)}
                    </Link>
                  );
                })}
              </nav>

              {/* Additional Links */}
              <div className="space-y-1 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <BookOpen className="w-5 h-5" />
                      {t('nav.myBookings')}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      {t('nav.wishlist')} ({wishlist.length})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 transition-colors"
                    >
                      {t('auth.register')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Language & Currency */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm font-medium text-gray-500 mb-3">{t('nav.language')}</p>
                <div className="flex gap-2 mb-6">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500 mb-3">{t('nav.currency')}</p>
                <div className="flex gap-2">
                  {Object.entries(CURRENCIES).map(([code, cur]) => (
                    <button
                      key={code}
                      onClick={() => changeCurrency(code)}
                      className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                        currency === code
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cur.symbol} {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Modal */}
<HeroSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
