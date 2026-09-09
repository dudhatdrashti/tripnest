import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Calendar, Users, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import PriceDisplay from '../components/ui/PriceDisplay';
import { formatDate, formatPrice } from '../utils/helpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const { bookings } = useApp();
  const { t } = useTranslation();
  const receiptRef = useRef(null);

  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('ui.bookingNotFound')}</h2>
          <Link to="/" className="text-primary-500 hover:text-primary-600">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const downloadReceipt = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const input = receiptRef.current;
    const canvas = await html2canvas(input, {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('booking.success')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('booking.successMessage')}</p>
        </motion.div>

        {/* Receipt */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div ref={receiptRef} className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-primary-500">TripNest</h2>
                <p className="text-sm text-gray-500">{t('ui.bookingReceipt')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{t('ui.bookingId')}</p>
                <p className="text-gray-500 text-sm">#{booking.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={booking.hotel.images[0]}
                  alt={booking.hotel.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{booking.hotel.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {booking.hotel.location.city}, {booking.hotel.location.country}
                  </p>
                  {booking.room && (
                    <p className="text-gray-500 text-sm mt-1">{booking.room.type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('ui.checkIn')}</p>
                    <p className="text-sm font-medium">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('ui.checkOut')}</p>
                    <p className="text-sm font-medium">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('booking.guests')}</p>
                    <p className="text-sm font-medium">{booking.guests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('ui.status')}</p>
                    <p className="text-sm font-medium text-green-600 capitalize">{booking.status}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {booking.hotel.price} × {booking.nights} nights
                  </span>
                  <span>{formatPrice(booking.priceBreakdown.basePrice, booking.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('ui.taxes', { percent: 12 })}</span>
                  <span>{formatPrice(booking.priceBreakdown.taxes, booking.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('ui.serviceFee', { percent: 8 })}</span>
                  <span>{formatPrice(booking.priceBreakdown.fees, booking.currency)}</span>
                </div>
                {booking.priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('ui.discount')}</span>
                    <span>-{formatPrice(booking.priceBreakdown.discount, booking.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold">{t('ui.total')}</span>
                  <span className="text-2xl font-bold text-primary-500">
                    {formatPrice(booking.priceBreakdown.total, booking.currency)}
                  </span>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm text-gray-500">{t('ui.guestName')}</p>
                <p className="font-medium">{booking.guestName}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={downloadReceipt}
              icon={Download}
            >
              {t('booking.downloadReceipt')}
            </Button>
            <Link to="/" className="flex-1">
              <Button variant="secondary" className="w-full" icon={Home}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
