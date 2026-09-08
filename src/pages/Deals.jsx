import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag, Clock, Sparkles, Percent, Copy, Check } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import OfferCard from '../components/cards/OfferCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SearchResultSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function Deals() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await api.getSpecialOffers();
        setOffers(data);
      } catch (error) {
        toast.error('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success('Promo code copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const features = [
    { icon: Percent, title: 'Best Price Guarantee', desc: 'Find a lower price and we will match it' },
    { icon: Clock, title: 'Limited Time Offers', desc: 'Exclusive deals updated daily' },
    { icon: Sparkles, title: 'Member Exclusive Deals', desc: 'Extra savings for registered members' },
    { icon: Gift, title: 'Free Cancellation', desc: 'Flexible booking on selected deals' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-accent-600 via-primary-600 to-primary-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: t('nav.deals') }]}
            onLight
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20 mb-6"
            >
              <Tag className="w-4 h-4" />
              Exclusive Deals &amp; Offers
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Save Big on Your Next Trip
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover unbeatable offers on premium hotels, resorts, and experiences worldwide.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                >
                  <feature.icon className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                  <div className="text-white font-semibold text-sm">{feature.title}</div>
                  <div className="text-white/60 text-xs mt-1">{feature.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Deals Filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Hot Deals This Week
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hand-picked offers with the biggest savings. Use the promo codes at checkout.
            </p>
          </motion.div>

          {loading ? (
            <SearchResultSkeleton />
          ) : offers.length === 0 ? (
            <EmptyState
              icon={Gift}
              title="No deals available"
              description="Check back soon for new exclusive offers."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Code Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">Active Promo Codes</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Copy a code and apply it at checkout for instant savings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-dashed border-primary-300 dark:border-primary-700 text-center"
              >
                <div className="text-5xl mb-3">-{offer.discount}%</div>
                <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{offer.description}</p>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {copied === offer.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {offer.code}
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
