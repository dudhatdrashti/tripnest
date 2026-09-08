import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Download,
  RefreshCw,
  X,
  Check,
  Clock,
  Briefcase,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PriceDisplay from '../components/ui/PriceDisplay';
import EmptyState from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import { formatPrice, formatDate } from '../utils/helpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const statusColors = {
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'neutral',
  pending: 'warning',
};

const statusIcons = {
  confirmed: Check,
  cancelled: X,
  completed: Check,
  pending: Clock,
};

export default function BookingHistory() {
  const { t } = useTranslation();
  const { bookings } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const downloadReceipt = async (booking) => {
    toast.success('Downloading receipt...');
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    try {
      const element = document.getElementById(`receipt-${booking.id}`);
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`TripNest-Booking-${booking.id}.pdf`);
      toast.success('Receipt downloaded!');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleBookAgain = (booking) => {
    window.location.href = `/hotel/${booking.hotel.id}`;
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Upcoming' },
    { id: 'completed', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{t('bookingHistory.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your trips and download receipts
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <ListSkeleton count={3} />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No bookings found"
            description={activeTab === 'all' ? "You haven't made any bookings yet" : `No ${activeTab} bookings`}
            actionLabel="Explore Hotels"
            onAction={() => (window.location.href = '/')}
          />
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status] || Clock;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden"
                >
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <img
                      src={booking.hotel.images[0]}
                      alt={booking.hotel.name}
                      className="w-full md:w-40 h-32 md:h-40 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{booking.hotel.name}</h3>
                          <p className="text-gray-500 flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4" />
                            {booking.hotel.location.city}, {booking.hotel.location.country}
                          </p>
                        </div>
                        <Badge variant={statusColors[booking.status] || 'neutral'}>
                          <StatusIcon className="w-3 h-3" />
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </span>
                        <span>{booking.guests} guests</span>
                        <span>{booking.hotel.room?.type || booking.room?.type}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <PriceDisplay
                          price={booking.priceBreakdown?.total || booking.hotel.price}
                          currency={booking.currency}
                        />
                        <div className="flex gap-2">
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleCancel(booking.id)}
                                icon={X}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleBookAgain(booking)}
                                icon={RefreshCw}
                              >
                                Book Again
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(booking)}
                            icon={Download}
                          >
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hidden receipt for PDF download */}
                  <div id={`receipt-${booking.id}`} className="hidden p-8 bg-white">
                    <div className="flex justify-between mb-6 pb-6 border-b">
                      <div>
                        <h2 className="text-2xl font-bold text-primary-500">TripNest</h2>
                        <p className="text-sm text-gray-500">Booking Receipt</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Booking ID</p>
                        <p className="text-gray-500 text-sm">#{booking.id}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">{booking.hotel.name}</h3>
                      <p className="text-gray-500">
                        {booking.hotel.location.city}, {booking.hotel.location.country}
                      </p>
                      <p>Check-in: {formatDate(booking.checkIn)}</p>
                      <p>Check-out: {formatDate(booking.checkOut)}</p>
                      <p>Guests: {booking.guests}</p>
                      <p>Guest: {booking.guestName}</p>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary-500">
                          {formatPrice(booking.priceBreakdown?.total || booking.hotel.price, booking.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
