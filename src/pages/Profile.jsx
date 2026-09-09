import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Settings,
  Moon,
  Sun,
  Globe,
  CreditCard,
  Bell,
  LogOut,
  Camera,
  Award,
  Plane,
  Briefcase,
  Star,
  Gift,
  CheckCircle2,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  Clock,
  TrendingUp,
  Compass,
  Wifi,
  Waves,
  Coffee,
  Snowflake,
  Dumbbell,
  Utensils,
  Shield,
  KeyRound,
History,
  Sparkles,
  Wallet,
  Trophy,
  Tag,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PriceDisplay from '../components/ui/PriceDisplay';
import DestinationCard from '../components/cards/DestinationCard';
import BookingStatisticsChart from '../components/charts/BookingStatisticsChart';
import DestinationPopularityChart from '../components/charts/DestinationPopularityChart';
import { hotels as allHotels, destinations as allDestinations } from '../data/hotels';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { formatPrice, formatDate, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Profile() {
  const { t } = useTranslation();
  const {
    state,
    bookings,
    wishlist,
    notifications,
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    currency,
    setCurrency,
    dispatch,
    user,
    updateUser,
    logout,
    changePassword,
  } = useApp();

  const [profile, setProfile] = useState({
    name: user?.name || 'Adventurer',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    memberSince: user?.memberSince || new Date().toISOString(),
  });

  const [savedDestinations, setSavedDestinations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  // Derive dashboard data from real context state
  const wishlistHotels = useMemo(
    () => allHotels.filter((h) => wishlist.includes(h.id)),
    [wishlist]
  );

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed'),
    [bookings]
  );
  const pastBookings = useMemo(
    () => bookings.filter((b) => b.status === 'completed'),
    [bookings]
  );
  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === 'cancelled'),
    [bookings]
  );

  // Saved destinations persisted in localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tripnest_saved_destinations') || '[]');
      const matched = allDestinations.filter((d) => saved.includes(d.id));
      setSavedDestinations(matched);
    } catch {
      setSavedDestinations([]);
    }
  }, []);

  // Reward points derived from bookings (mock calculations from real data)
  useEffect(() => {
    setRewardPoints(bookings.reduce((sum, b) => sum + (b.guests || 1) * 100, 0));
  }, [bookings]);

  // Recent activity derived from real state
  useEffect(() => {
    const activity = [];
    if (wishlist.length > 0) {
      activity.push({
        id: 'wishlist',
        icon: Heart,
        text: `Added ${wishlist.length} hotel${wishlist.length > 1 ? 's' : ''} to wishlist`,
        time: 'Recently updated',
        color: 'text-red-500 bg-red-50 dark:bg-red-900/30',
      });
    }
    bookings.slice(0, 3).forEach((b, i) => {
      activity.push({
        id: `booking-${b.id}`,
        icon: i === 0 ? CheckCircle2 : Briefcase,
        text: `Booked ${b.hotel?.name || 'a hotel'}`,
        time: `${formatDate(b.createdAt)} · ${b.status}`,
        color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/30',
      });
    });
    if (notifications.length > 0) {
      activity.push({
        id: 'notif',
        icon: Bell,
        text: `${notifications.length} notification${notifications.length > 1 ? 's' : ''} received`,
        time: 'Inbox',
        color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30',
      });
    }
    setRecentActivity(activity);
  }, [wishlist, bookings, notifications]);

  const handleSaveProfile = () => {
    updateUser({ name: profile.name, phone: profile.phone, location: profile.location });
    toast.success(t('auth.profileUpdated') || 'Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    toast.success(t('auth.logoutSuccess') || 'Logged out successfully');
  };

  const handleRemoveWishlist = (id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
    toast.success(t('ui.removedWishlist'));
  };

  const handleAddSavedDestination = (id) => {
    try {
      const current = JSON.parse(localStorage.getItem('tripnest_saved_destinations') || '[]');
      if (current.includes(id)) {
        const next = current.filter((d) => d !== id);
        localStorage.setItem('tripnest_saved_destinations', JSON.stringify(next));
        setSavedDestinations(allDestinations.filter((d) => next.includes(d.id)));
        toast.success(t('ui.destinationRemoved'));
      } else {
        const next = [...current, id];
        localStorage.setItem('tripnest_saved_destinations', JSON.stringify(next));
        setSavedDestinations(allDestinations.filter((d) => next.includes(d.id)));
        toast.success(t('ui.destinationSaved'));
      }
    } catch {
      toast.error(t('ui.savedUpdateFailed'));
    }
  };

  const downloadReceipt = async (booking) => {
    toast.success(t('ui.downloadingReceipt'));
    try {
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const element = document.getElementById(`receipt-${booking.id}`);
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`TripNest-Booking-${booking.id}.pdf`);
      toast.success(t('ui.receiptDownloaded'));
    } catch {
      toast.error(t('ui.failedReceipt'));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ---------- STAT CARDS ----------
  const statCards = [
    {
      label: t('ui.totalTrips'),
      value: bookings.length,
      icon: Plane,
      gradient: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/30',
    },
    {
      label: t('ui.upcoming'),
      value: upcomingBookings.length,
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/30',
    },
    {
      label: t('nav.wishlist'),
      value: wishlist.length,
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-500/30',
    },
    {
      label: t('ui.savedDestinationsTab'),
      value: savedDestinations.length,
      icon: Compass,
      gradient: 'from-violet-500 to-purple-500',
      shadow: 'shadow-violet-500/30',
    },
    {
      label: t('ui.reviews'),
      value: 4,
      icon: Star,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/30',
    },
    {
      label: t('ui.rewardPoints'),
      value: rewardPoints,
      icon: Gift,
      gradient: 'from-fuchsia-500 to-pink-500',
      shadow: 'shadow-fuchsia-500/30',
    },
  ];

  const StatCard = ({ stat }) => {
    const [count, ref] = useAnimatedCounter(stat.value, 1600);
    const Icon = stat.icon;
    return (
      <motion.div
        variants={item}
        ref={ref}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all border border-gray-100 dark:border-gray-700"
      >
        <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-15 blur-xl`} />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  // ---------- PROFILE CARD ----------
  const profileCard = (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      {/* Header gradient */}
      <div className="h-28 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 relative">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 20% 20%, white 0%, transparent 50%)' }} />
      </div>
      <div className="px-6 sm:px-8 pb-8 -mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white ring-4 ring-white dark:ring-gray-800 shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                getInitials(user?.name || 'U')
              )}
            </div>
          </div>
          <div className="flex-1 sm:pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <Badge variant="primary">
                <Award className="w-3 h-3" /> {t('ui.vipMember')}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {t('ui.memberSince')} {formatDate(profile.memberSince)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 sm:pb-1">
<Button variant="secondary" size="sm" onClick={() => setActiveTabIndex(5)}>
              <Settings className="w-4 h-4" /> {t('ui.editProfile')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ---------- OVERVIEW ----------
  const overviewTab = (
    <div className="space-y-8">
      {/* Upcoming trip + recent booking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary-500" /> {t('ui.upcomingTrip')}
            </h3>
            {upcomingBookings.length > 0 && (
              <Link to="/bookings" className="text-xs text-primary-500 hover:underline flex items-center gap-0.5">
                {t('common.viewAll')} <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {upcomingBookings.length > 0 ? (
            <UpcomingTripCard booking={upcomingBookings[0]} />
          ) : (
            <EmptyState icon={Plane} title={t('ui.noUpcomingTrips')} description={t('ui.planAdventure')} actionLabel={t('ui.exploreHotels')} onAction={() => (window.location.href = '/')} />
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-500" /> {t('ui.recentBooking')}
            </h3>
            {bookings.length > 0 && (
              <Link to="/bookings" className="text-xs text-primary-500 hover:underline flex items-center gap-0.5">
                {t('common.viewAll')} <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {bookings.length > 0 ? (
            <UpcomingTripCard booking={bookings[0]} />
          ) : (
            <EmptyState icon={Briefcase} title={t('ui.noBookings')} description={t('ui.recentBookings')} actionLabel={t('ui.bookNow')} onAction={() => (window.location.href = '/')} />
          )}
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('ui.bookingStatistics')}</h3>
          <BookingStatisticsChart />
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('ui.destinationPopularity')}</h3>
          <DestinationPopularityChart />
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-violet-500" /> {t('ui.recentActivity')}
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{act.text}</p>
                    <p className="text-xs text-gray-400">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-6 text-center">{t('ui.noRecentActivity')}</p>
        )}
      </motion.div>

      {/* Recommended destinations + achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" /> {t('ui.recommendedDestinations')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allDestinations.slice(0, 4).map((dest, i) => (
              <Link key={dest.id} to={`/destination/${dest.id}`} className="group relative overflow-hidden rounded-xl h-36">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-semibold">{dest.name}</p>
                  <p className="text-xs text-white/80">{dest.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> {t('ui.travelAchievements')}
          </h3>
          <div className="space-y-3">
            {[
              { icon: Plane, label: t('ui.tripsBooked', { count: bookings.length }), done: bookings.length > 0, color: 'from-blue-500 to-indigo-500' },
              { icon: Compass, label: t('ui.destinationsSaved', { count: savedDestinations.length }), done: savedDestinations.length > 0, color: 'from-violet-500 to-purple-500' },
              { icon: Heart, label: t('ui.hotelsWishlist', { count: wishlist.length }), done: wishlist.length >= 3, color: 'from-rose-500 to-pink-500' },
              { icon: Star, label: t('ui.firstReview'), done: true, color: 'from-amber-500 to-orange-500' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} ${a.done ? 'opacity-100' : 'opacity-30'} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.label}</p>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: a.done ? '100%' : '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${a.color}`}
                      />
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${a.done ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );

  // ---------- BOOKINGS ----------
  const bookingsTab = (
    <div className="space-y-8">
      <BookingSection title={t('ui.upcomingBookings')} bookings={upcomingBookings} icon={Calendar} emptyText={t('ui.noUpcomingBookings')} onDownload={downloadReceipt} />
      <BookingSection title={t('ui.pastBookings')} bookings={pastBookings} icon={History} emptyText={t('ui.noPastBookings')} onDownload={downloadReceipt} />
      <BookingSection title={t('ui.cancelled')} bookings={cancelledBookings} icon={X} emptyText={t('ui.noCancelledBookings')} onDownload={downloadReceipt} />
    </div>
  );

  // ---------- WISHLIST ----------
  const wishlistTab = (
    <div>
      {wishlistHotels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistHotels.map((hotel, i) => (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="relative h-40">
                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                <button onClick={() => handleRemoveWishlist(hotel.id)} className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-red-500 hover:text-white transition-colors" aria-label={t('ui.removeFromWishlist')}>
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{hotel.name}</h4>
                  <span className="flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {hotel.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {hotel.location.city}, {hotel.location.country}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <PriceDisplay price={hotel.price} showPerNight={false} />
                  <div className="flex gap-2">
                    <Link to={`/hotel/${hotel.id}`} className="text-xs font-medium text-primary-500 hover:underline">{t('ui.view')}</Link>
                    <Link to={`/booking/${hotel.id}`} className="text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 px-3 py-1.5 rounded-lg">
                      {t('ui.bookNow')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Heart} title={t('ui.wishlistEmpty')} description={t('ui.saveHotels')} actionLabel={t('ui.exploreHotels')} onAction={() => (window.location.href = '/')} />
      )}
    </div>
  );

  // ---------- SAVED DESTINATIONS ----------
  const destinationsTab = (
    <div>
      {savedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDestinations.map((dest, i) => (
            <div key={dest.id} className="relative group">
              <DestinationCard destination={dest} index={i} />
              <button
                onClick={() => handleAddSavedDestination(dest.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-red-500 hover:text-white transition-colors"
                aria-label={t('ui.removeSavedDestination')}
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Compass} title={t('ui.savedDestinations')} description={t('ui.saveDestinations')} actionLabel={t('ui.exploreDestinations')} onAction={() => (window.location.href = '/destinations')} />
      )}
    </div>
  );

  // ---------- NOTIFICATIONS ----------
  const notificationsTab = (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Notifications {unreadCount > 0 && <Badge variant="danger">{unreadCount} new</Badge>}
        </h3>
        {notifications.length > 0 && (
          <button onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })} className="text-xs text-primary-500 hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const variants = {
              confirmed: 'from-emerald-500 to-teal-500',
              offer: 'from-amber-500 to-orange-500',
              discount: 'from-rose-500 to-pink-500',
              price: 'from-blue-500 to-indigo-500',
            };
            const iconMap = {
              confirmed: CheckCircle2,
              offer: Gift,
              discount: Tag,
              price: TrendingUp,
            };
            const Icon = iconMap[n.type] || Bell;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${n.read ? 'bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-primary-100 dark:border-primary-800'}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${variants[n.type] || 'from-gray-400 to-gray-500'} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Bell} title={t('ui.noNotifications')} description={t('ui.allCaughtUp')} />
      )}
    </div>
  );

  // ---------- SETTINGS ----------
  const settingsTab = (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Settings */}
      <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-500" /> {t('ui.profileSettings')}
        </h3>
        <div className="space-y-4">
          <Input label={t('auth.fullName')} icon={User} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Input label={t('auth.email')} icon={Mail} type="email" value={profile.email} disabled />
          <Input label={t('auth.phone')} icon={Phone} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <Input label={t('auth.location')} icon={MapPin} value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          <Button variant="primary" onClick={handleSaveProfile}>
            {t('ui.saveChanges')}
          </Button>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-500" /> {t('auth.changePassword')}
        </h3>
        <div className="space-y-4">
          <Input label={t('auth.currentPassword')} icon={Lock} type="password" id="currentPassword" />
          <Input label={t('auth.newPassword')} icon={Lock} type="password" id="newPassword" />
          <Button variant="secondary" onClick={() => toast.success(t('ui.passwordSoon'))}>
            {t('ui.updatePassword')}
          </Button>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4 text-violet-500" /> {t('ui.preferences')}
        </h3>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t('ui.darkMode')}</p>
              <p className="text-sm text-gray-500">{t('ui.toggleDarkTheme')}</p>
            </div>
          </div>
          <button onClick={toggleDarkMode} className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors" aria-label={t('ui.toggleDarkMode')}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${darkMode ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary-500" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t('ui.language')}</p>
              <p className="text-sm text-gray-500">{t('ui.selectLanguage')}</p>
            </div>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-primary-500" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t('ui.currency')}</p>
              <p className="text-sm text-gray-500">{t('ui.selectCurrency')}</p>
            </div>
          </div>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        {/* Notification Preferences */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary-500" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t('ui.notifications')}</p>
              <p className="text-sm text-gray-500">{t('ui.manageNotifications')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success(t('ui.notificationsUpdated'))}>
            {t('ui.manage')}
          </Button>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item} className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
<Button variant="danger" onClick={handleLogout} className="w-full">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </motion.div>
    </div>
  );

  const tabs = [
    { label: t('ui.overview'), content: overviewTab },
    { label: t('ui.bookings'), content: bookingsTab },
    { label: t('nav.wishlist'), content: wishlistTab },
    { label: t('ui.savedDestinationsTab'), content: destinationsTab },
    { label: t('ui.notificationsTab'), content: notificationsTab },
    { label: t('ui.settingsTab'), content: settingsTab },
  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          {/* Profile Card */}
          {profileCard}

          {/* Quick Statistics */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div variants={item} className="rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-2 sm:p-3">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTabIndex(i)}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTabIndex === i
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {activeTabIndex === i && (
                    <motion.span
                      layoutId="profile-tab-pill"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="p-2 sm:p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {tabs[activeTabIndex].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------- Helper components ----------

function UpcomingTripCard({ booking }) {
  return (
    <div className="flex items-center gap-4">
      <img src={booking.hotel?.images?.[0]} alt={booking.hotel?.name} className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{booking.hotel?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" /> {booking.hotel?.location?.city}, {booking.hotel?.location?.country}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
        </p>
      </div>
      <Prices booking={booking} />
    </div>
  );
}

function Prices({ booking }) {
  return (
    <div className="text-right shrink-0">
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {formatPrice(booking.priceBreakdown?.total || booking.hotel?.price || 0, booking.currency)}
      </p>
      <Badge variant={booking.status === 'confirmed' ? 'success' : 'neutral'}>{booking.status}</Badge>
    </div>
  );
}

function BookingSection({ title, bookings: list, icon: Icon, emptyText, onDownload }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary-500" /> {title}
        {list.length > 0 && <Badge variant="neutral">{list.length}</Badge>}
      </h3>
      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((booking) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700">
              <img src={booking.hotel?.images?.[0]} alt={booking.hotel?.name} className="w-full sm:w-24 h-24 sm:h-20 rounded-xl object-cover" loading="lazy" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{booking.hotel?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} · {booking.guests} guests
                </p>
                <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'neutral'} className="mt-1">{booking.status}</Badge>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {formatPrice(booking.priceBreakdown?.total || booking.hotel?.price || 0, booking.currency)}
                </span>
                <div className="flex gap-2">
                  {booking.status === 'confirmed' && (
                    <Link to={`/hotel/${booking.hotel?.id}`} className="text-xs font-medium text-primary-500 hover:underline flex items-center gap-0.5">
                      <RefreshCw className="w-3 h-3" /> Book Again
                    </Link>
                  )}
                  <button onClick={() => onDownload(booking)} className="text-xs font-medium text-gray-500 hover:text-primary-500 flex items-center gap-0.5">
                    <Download className="w-3 h-3" /> Receipt
                  </button>
                </div>
              </div>
              {/* Hidden receipt */}
              <div id={`receipt-${booking.id}`} className="hidden p-8 bg-white">
                <div className="flex justify-between mb-6 pb-6 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-500">TripNest</h2>
                    <p className="text-sm text-gray-500">{t('ui.bookingReceipt')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{t('ui.bookingId')}</p>
                    <p className="text-gray-500 text-sm">#{booking.id}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{booking.hotel?.name}</h3>
                  <p className="text-gray-500">{booking.hotel?.location?.city}, {booking.hotel?.location?.country}</p>
                  <p>Check-in: {formatDate(booking.checkIn)}</p>
                  <p>Check-out: {formatDate(booking.checkOut)}</p>
                  <p>Guests: {booking.guests}</p>
                  <p>Guest: {booking.guestName}</p>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold">{t('ui.total')}</span>
                    <span className="text-2xl font-bold text-primary-500">
                      {formatPrice(booking.priceBreakdown?.total || booking.hotel?.price || 0, booking.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Icon} title={emptyText} description={t('ui.bookingsAppear')} />
      )}
    </div>
  );
}
