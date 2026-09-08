import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLoader } from '../components/loaders/PageLoader';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Lazy loaded pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const SearchResults = lazy(() => import('../pages/SearchResults'));
const HotelDetails = lazy(() => import('../pages/HotelDetails'));
const DestinationDetails = lazy(() => import('../pages/DestinationDetails'));
const Destinations = lazy(() => import('../pages/Destinations'));
const Hotels = lazy(() => import('../pages/Hotels'));
const Deals = lazy(() => import('../pages/Deals'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Booking = lazy(() => import('../pages/Booking'));
const BookingSuccess = lazy(() => import('../pages/BookingSuccess'));
const Profile = lazy(() => import('../pages/Profile'));
const BookingHistory = lazy(() => import('../pages/BookingHistory'));
const TripPlanner = lazy(() => import('../pages/TripPlanner'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route path="/booking/:hotelId" element={<Booking />} />
        <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
