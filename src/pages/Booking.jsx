import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Ticket,
  Calendar,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PriceDisplay from '../components/ui/PriceDisplay';
import { calculateBookingPrice, calculateNights, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Booking() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch, currency } = useApp();

  const bookingData = location.state || {};
  const hotel = bookingData.hotel;
  const room = bookingData.room;
  const checkInDate = bookingData.checkIn || new Date().toISOString().split('T')[0];
  const checkOutDate = bookingData.checkOut || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const guests = bookingData.guests || 2;

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('ui.noHotelSelected')}</h2>
          <Button onClick={() => navigate('/')}>{t('ui.backToHome')}</Button>
        </div>
      </div>
    );
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  const priceBreakdown = calculateBookingPrice(
    room?.price || hotel.price,
    nights,
    guests,
    appliedPromo
  );

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setAppliedPromo(promoCode.trim().toUpperCase());
    toast.success(t('ui.promoApplied'));
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const booking = await api.createBooking({
        hotel,
        room,
        guestName: data.fullName,
        email: data.email,
        phone: data.phone,
        specialRequests: data.specialRequests,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        nights,
        promoCode: appliedPromo,
        priceBreakdown,
        currency,
      });

      dispatch({ type: 'ADD_BOOKING', payload: booking });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'booking',
          title: t('ui.bookingConfirmedTitle'),
          message: t('ui.bookingConfirmedMessage', { hotel: hotel.name }),
          read: false,
          createdAt: new Date().toISOString(),
        },
      });

      toast.success(t('ui.bookingConfirmed'));
      navigate(`/booking-success/${booking.id}`);
    } catch (error) {
      toast.error(t('ui.bookingFailed'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-4xl font-bold gradient-text mb-8">{t('booking.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow"
            >
              <h2 className="text-xl font-semibold mb-6">{t('booking.personalInfo')}</h2>

              <div className="space-y-4">
                <Input
                  label={t('booking.fullName')}
                  icon={User}
                  placeholder={t('booking.fullName')}
                  error={errors.fullName?.message}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  })}
                />

                <Input
                  label={t('booking.email')}
                  icon={Mail}
                  type="email"
                  placeholder={t('booking.email')}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                <Input
                  label={t('booking.phone')}
                  icon={Phone}
                  type="tel"
                  placeholder={t('booking.phone')}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+\d\s-]{8,}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('booking.specialRequests')}
                  </label>
                  <div className="flex items-start gap-3">
                    <textarea
                      rows={4}
                      placeholder={t('ui.specialRequestsPlaceholder')}
                      className="input-field"
                      {...register('specialRequests')}
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('booking.promoCode')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={t('ui.enterPromo')}
                      className="input-field flex-1"
                    />
                    <Button variant="secondary" onClick={handleApplyPromo} type="button">
                      {t('booking.apply')}
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Promo code {appliedPromo} applied
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6"
                loading={processing}
              >
                {t('booking.confirm')}
              </Button>
            </motion.form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow sticky top-24">
              <h2 className="text-xl font-semibold mb-4">{t('booking.summary')}</h2>

              {/* Hotel info */}
              <div className="flex gap-3 mb-6">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold">{hotel.name}</h3>
                  <p className="text-sm text-gray-500">{hotel.location.city}, {hotel.location.country}</p>
                  {room && (
                    <p className="text-sm text-gray-500 mt-1">{room.type}</p>
                  )}
                </div>
              </div>

              {/* Dates and guests */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(checkInDate)} - {formatDate(checkOutDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{guests} guests · {nights} {t('booking.nights')}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {room?.price || hotel.price} × {nights} {t('booking.nights')}
                  </span>
                  <PriceDisplay price={priceBreakdown.basePrice} showPerNight={false} className="text-sm font-medium" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('booking.taxes')} (12%)</span>
                  <PriceDisplay price={priceBreakdown.taxes} showPerNight={false} className="text-sm font-medium" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('ui.serviceFee', { percent: 8 })}</span>
                  <PriceDisplay price={priceBreakdown.fees} showPerNight={false} className="text-sm font-medium" />
                </div>
                {priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('ui.discount')}</span>
                    <span>-{formatPrice(priceBreakdown.discount, currency)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                <span className="font-semibold">{t('booking.total')}</span>
                <PriceDisplay price={priceBreakdown.total} className="text-3xl" />
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-green-500" />
                Secure payment · Free cancellation on most bookings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
