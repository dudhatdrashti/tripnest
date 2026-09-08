import { CURRENCIES } from '../constants';

export const formatPrice = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = (amount * currency.rate).toFixed(2);
  return `${currency.symbol}${Number(converted).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateRange = (startDate, endDate) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const calculateNights = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
};

export const calculateBookingPrice = (pricePerNight, nights, guestCount, promoCode = '') => {
  const basePrice = pricePerNight * nights;
  const taxRate = 0.12;
  const serviceFee = 0.08;
  const taxes = basePrice * taxRate;
  const fees = basePrice * serviceFee;
  let discount = 0;

  if (promoCode) {
    const discounts = {
      EARLYBIRD25: 0.25,
      WEEKEND40: 0.40,
      FAMILY30: 0.30,
    };
    discount = basePrice * (discounts[promoCode] || 0);
  }

  const subtotal = basePrice + taxes + fees;
  const total = subtotal - discount;

  return {
    basePrice,
    taxes,
    fees,
    discount,
    subtotal,
    total,
    nights,
  };
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getImageUrl = (url, width = 400) => {
  if (!url) return '';
  return url.replace(/w=\d+/, `w=${width}`);
};

export const shareHotel = async (hotel) => {
  const shareData = {
    title: hotel.name,
    text: `Check out ${hotel.name} in ${hotel.location.city}!`,
    url: `${window.location.origin}/hotel/${hotel.id}`,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch {
      return false;
    }
  } else {
    navigator.clipboard.writeText(shareData.url);
    return 'copied';
  }
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
