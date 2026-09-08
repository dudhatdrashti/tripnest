import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS, hashPassword } from '../constants';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

const getInitialWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
  } catch {
    return [];
  }
};

const getInitialRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)) || [];
  } catch {
    return [];
  }
};

const getInitialRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)) || [];
  } catch {
    return [];
  }
};

const getInitialBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
  } catch {
    return [];
  }
};

const getInitialNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
  } catch {
    return [];
  }
};

const getInitialUser = () => {
  try {
    if (localStorage.getItem(STORAGE_KEYS.SESSION) !== 'true') return null;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  } catch {
    return null;
  }
};

const getInitialUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
  } catch {
    return {};
  }
};

const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  users: getInitialUsers(),
  darkMode: localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true',
  language: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
  currency: localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD',
  wishlist: getInitialWishlist(),
  recentlyViewed: getInitialRecentlyViewed(),
  recentSearches: getInitialRecentSearches(),
  bookings: getInitialBookings(),
  notifications: getInitialNotifications(),
};

function reducer(state, action) {
  switch (action.type) {
    // Wishlist
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.includes(action.payload)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((id) => id !== action.payload),
      };
    case 'CLEAR_WISHLIST':
      return { ...state, wishlist: [] };

    // Recently Viewed
    case 'ADD_RECENTLY_VIEWED':
      return {
        ...state,
        recentlyViewed: [
          action.payload,
          ...state.recentlyViewed.filter((id) => id !== action.payload),
        ].slice(0, 12),
      };

// Recent Searches
    case 'ADD_RECENT_SEARCH':
      return {
        ...state,
        recentSearches: [
          action.payload,
          ...state.recentSearches.filter((s) => s !== action.payload),
        ].slice(0, 8),
      };
    case 'CLEAR_RECENT_SEARCHES':
      return { ...state, recentSearches: [] };

    // Dark Mode
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    // Language
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    // Currency
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };

    // Bookings
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING_STATUS':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload.id
            ? { ...b, status: action.payload.status }
            : b
        ),
      };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
      };

    // Notifications
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

// User
    case 'REGISTER':
      return {
        ...state,
        users: { ...state.users, [action.payload.email]: action.payload },
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_USER':
      if (action.payload) {
        return { ...state, user: action.payload, isAuthenticated: true };
      }
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        users: {
          ...state.users,
          [state.user.email]: { ...state.users[state.user.email], ...action.payload },
        },
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.RECENTLY_VIEWED,
      JSON.stringify(state.recentlyViewed)
    );
  }, [state.recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(state.recentSearches)
    );
  }, [state.recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(state.bookings));
  }, [state.bookings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(state.notifications)
    );
  }, [state.notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(state.darkMode));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language);
  }, [state.language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, state.currency);
  }, [state.currency]);

useEffect(() => {
    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
  }, [state.users]);

  // Auth actions
  const register = ({ name, email, password, country, phone, location }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (state.users[normalizedEmail]) {
      return { error: 'exists' };
    }
    const newUser = {
      id: generateId(),
      name,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      country,
      phone: phone || '',
      location: location || '',
      avatar: '',
      memberSince: new Date().toISOString(),
      preferences: { currency: 'USD', language: 'en' },
    };
    dispatch({ type: 'REGISTER', payload: newUser });
    localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    return { success: true, user: newUser };
  };

  const login = ({ email, password, rememberMe }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const storedUser = state.users[normalizedEmail];
    if (!storedUser || storedUser.passwordHash !== hashPassword(password)) {
      return { error: 'invalid' };
    }
    const { passwordHash, ...safeUser } = storedUser;
    dispatch({ type: 'LOGIN', payload: safeUser });
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    }
    return { success: true, user: safeUser };
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  const updateUser = (updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    return { success: true };
  };

  const changePassword = ({ currentPassword, newPassword }) => {
    const storedUser = state.users[state.user?.email];
    if (!storedUser || storedUser.passwordHash !== hashPassword(currentPassword)) {
      return { error: 'wrongPassword' };
    }
    const updated = { ...storedUser, passwordHash: hashPassword(newPassword) };
    dispatch({ type: 'UPDATE_USER', payload: { passwordHash: updated.passwordHash } });
    dispatch({ type: 'REGISTER', payload: updated });
    return { success: true };
  };

  const forgotPassword = ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!state.users[normalizedEmail]) {
      return { error: 'notFound' };
    }
    return { success: true };
  };

  const isInWishlist = (hotelId) => state.wishlist.includes(hotelId);

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });
  const setLanguage = (lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const setCurrency = (cur) => dispatch({ type: 'SET_CURRENCY', payload: cur });

  const value = {
    state,
    dispatch,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    users: state.users,
    darkMode: state.darkMode,
    language: state.language,
    currency: state.currency,
    wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed,
    recentSearches: state.recentSearches,
bookings: state.bookings,
    notifications: state.notifications,
    unreadNotifications: state.notifications.filter((n) => !n.read).length,
    isInWishlist,
    toggleDarkMode,
    setLanguage,
    setCurrency,
    register,
    login,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
