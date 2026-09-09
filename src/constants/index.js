export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'ui.sortRecommended' },
  { value: 'popularity', label: 'ui.sortPopularity' },
  { value: 'newest', label: 'ui.sortNewest' },
  { value: 'rating', label: 'ui.sortHighestRated' },
  { value: 'price-asc', label: 'ui.sortPriceLow' },
  { value: 'price-desc', label: 'ui.sortPriceHigh' },
];

export const PROPERTY_FEATURES = [
  { id: 'freeCancellation', label: 'ui.freeCancellation', icon: 'ShieldCheck', category: 'convenience' },
  { id: 'breakfast', label: 'ui.breakfastIncluded', icon: 'Coffee', category: 'dining' },
  { id: 'pool', label: 'ui.swimmingPool', icon: 'SwimmingPool', category: 'recreation' },
  { id: 'parking', label: 'ui.parking', icon: 'ParkingCircle', category: 'convenience' },
  { id: 'wifi', label: 'ui.wifi', icon: 'Wifi', category: 'convenience' },
  { id: 'ac', label: 'ui.airConditioning', icon: 'Snowflake', category: 'comfort' },
  { id: 'family', label: 'ui.familyFriendly', icon: 'Users', category: 'convenience' },
  { id: 'pets', label: 'ui.petFriendly', icon: 'PawPrint', category: 'convenience' },
];

export const AMENITIES_LIST = [
  { id: 'wifi', label: 'ui.freeWifi', icon: 'Wifi' },
  { id: 'pool', label: 'ui.swimmingPool', icon: 'SwimmingPool' },
  { id: 'spa', label: 'ui.spaWellness', icon: 'Sparkles' },
  { id: 'gym', label: 'ui.fitnessCenter', icon: 'Dumbbell' },
  { id: 'restaurant', label: 'ui.restaurant', icon: 'UtensilsCrossed' },
  { id: 'bar', label: 'ui.barLounge', icon: 'Wine' },
  { id: 'parking', label: 'ui.freeParking', icon: 'ParkingCircle' },
  { id: 'ac', label: 'ui.airConditioning', icon: 'Snowflake' },
  { id: 'breakfast', label: 'ui.breakfastIncluded', icon: 'Coffee' },
  { id: 'pets', label: 'ui.petFriendly', icon: 'PawPrint' },
  { id: 'airport', label: 'ui.airportShuttle', icon: 'Plane' },
  { id: 'laundry', label: 'ui.laundryService', icon: 'Shirt' },
];

export const PROPERTY_TYPES = [
  { value: 'hotel', label: 'ui.hotel' },
  { value: 'resort', label: 'ui.resort' },
  { value: 'villa', label: 'ui.villa' },
  { value: 'apartment', label: 'ui.apartment' },
  { value: 'cottage', label: 'ui.cottage' },
  { value: 'boutique', label: 'ui.boutiqueHotel' },
];

export const PRICE_RANGES = [
  { value: '0-100', label: 'Under $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200-500', label: '$200 - $500' },
  { value: '500-1000', label: '$500 - $1000' },
  { value: '1000+', label: '$1000+' },
];

export const RATING_FILTERS = [
  { value: 4.5, label: '4.5 & Above' },
  { value: 4, label: '4.0 & Above' },
  { value: 3.5, label: '3.5 & Above' },
  { value: 3, label: '3.0 & Above' },
];

export const STORAGE_KEYS = {
  WISHLIST: 'tripnest_wishlist',
  RECENTLY_VIEWED: 'tripnest_recently_viewed',
  RECENT_SEARCHES: 'tripnest_recent_searches',
  BOOKINGS: 'tripnest_bookings',
  USER: 'tripnest_user',
  USERS: 'tripnest_users',
  SESSION: 'tripnest_session',
  CHAT_POSITION: 'tripnest_chat_position',
  DARK_MODE: 'tripnest_dark_mode',
  LANGUAGE: 'tripnest_language',
  CURRENCY: 'tripnest_currency',
  NOTIFICATIONS: 'tripnest_notifications',
};

// Simple hash for demo password storage (frontend only)
export const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `h${Math.abs(hash).toString(36)}${password.length}`;
};

export const COUNTRIES = [
  'United States',
  'India',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Canada',
  'Australia',
  'United Arab Emirates',
  'Japan',
  'Singapore',
  'Thailand',
  'Brazil',
  'Mexico',
  'Netherlands',
  'Switzerland',
  'Greece',
  'Portugal',
  'Turkey',
];

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
