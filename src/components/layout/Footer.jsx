import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Apple,
  Play,
  Check,
} from 'lucide-react';
import { destinations } from '../../data/hotels';
import toast from 'react-hot-toast';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail('');
      toast.success('Subscribed to newsletter!');
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                TripNest
              </span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm">
              Your premium travel booking platform. Discover extraordinary destinations and book unforgettable experiences worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-sm">hello@tripnest.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm">123 Travel Street, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="font-semibold text-white mb-4">Popular Destinations</h3>
            <ul className="space-y-3">
              {destinations.slice(0, 6).map((dest) => (
                <li key={dest.id}>
                  <Link
                    to={`/destination/${dest.id}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-400 transition-colors" />
                    {dest.name}, {dest.country}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{t('footer.about')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{t('footer.careers')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{t('footer.press')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{t('footer.blog')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('home.newsletter')}</h3>
            <p className="text-gray-400 text-sm mb-4">{t('home.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-10 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Email address"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg hover:opacity-90 transition-opacity"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>

            {/* App buttons */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-gray-500 mb-2">Get the app</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Apple className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Download on the</p>
                    <p className="text-xs font-medium">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Play className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Get it on</p>
                    <p className="text-xs font-medium">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-8">
          <ul className="flex flex-wrap gap-6 text-sm">
            <li><Link to="/privacy" className="text-gray-500 hover:text-primary-400 transition-colors">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms" className="text-gray-500 hover:text-primary-400 transition-colors">{t('footer.terms')}</Link></li>
            <li><Link to="/privacy" className="text-gray-500 hover:text-primary-400 transition-colors">{t('footer.cookies')}</Link></li>
          </ul>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">&copy; 2024 TripNest. {t('home.footer')}</p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-primary-400 transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-primary-400 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-primary-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-primary-400 transition-colors"
              >
                <Youtube className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Check className="w-3 h-3 text-primary-500" />
            Secure payments · Free cancellation on most bookings · 24/7 support
          </div>
        </div>
      </div>
    </footer>
  );
}
