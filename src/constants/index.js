export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const PROPERTY_FEATURES = [
  { id: 'freeCancellation', label: 'Free Cancellation', icon: 'ShieldCheck', category: 'convenience' },
  { id: 'breakfast', label: 'Breakfast Included', icon: 'Coffee', category: 'dining' },
  { id: 'pool', label: 'Swimming Pool', icon: 'SwimmingPool', category: 'recreation' },
  { id: 'parking', label: 'Parking', icon: 'ParkingCircle', category: 'convenience' },
  { id: 'wifi', label: 'WiFi', icon: 'Wifi', category: 'convenience' },
  { id: 'ac', label: 'Air Conditioning', icon: 'Snowflake', category: 'comfort' },
  { id: 'family', label: 'Family Friendly', icon: 'Users', category: 'convenience' },
  { id: 'pets', label: 'Pet Friendly', icon: 'PawPrint', category: 'convenience' },
];

export const AMENITIES_LIST = [
  { id: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
  { id: 'pool', label: 'Swimming Pool', icon: 'SwimmingPool' },
  { id: 'spa', label: 'Spa & Wellness', icon: 'Sparkles' },
  { id: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
  { id: 'restaurant', label: 'Restaurant', icon: 'UtensilsCrossed' },
  { id: 'bar', label: 'Bar & Lounge', icon: 'Wine' },
  { id: 'parking', label: 'Free Parking', icon: 'ParkingCircle' },
  { id: 'ac', label: 'Air Conditioning', icon: 'Snowflake' },
  { id: 'breakfast', label: 'Breakfast Included', icon: 'Coffee' },
  { id: 'pets', label: 'Pet Friendly', icon: 'PawPrint' },
  { id: 'airport', label: 'Airport Shuttle', icon: 'Plane' },
  { id: 'laundry', label: 'Laundry Service', icon: 'Shirt' },
];

export const PROPERTY_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'boutique', label: 'Boutique Hotel' },
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

