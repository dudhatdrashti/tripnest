import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/ui/Accordion';

const faqs = [
  {
    question: 'How do I book a hotel on TripNest?',
    answer:
      'Booking is simple! Search for your destination, select a hotel, choose your dates and room type, then complete the booking form. You will receive instant confirmation.',
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer:
      'Yes! Most bookings come with free cancellation up to 48 hours before check-in. You can manage your bookings from your profile under "Booking History".',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various local payment methods depending on your region.',
  },
  {
    question: 'How do I get a receipt for my booking?',
    answer:
      'After booking, you can download a PDF receipt from the booking success page or from your booking history at any time.',
  },
  {
    question: 'Can I use promo codes?',
    answer:
      'Absolutely! Enter your promo code on the booking page before confirming. The discount will be applied automatically to your total.',
  },
  {
    question: 'How does the AI Trip Planner work?',
    answer:
      'Our AI Trip Planner generates a personalized itinerary based on your destination, budget, number of days, and interests. It suggests hotels, restaurants, and activities.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes! We use industry-standard 256-bit SSL encryption and are fully PCI-DSS compliant to ensure your data is always protected.',
  },
  {
    question: 'Do you offer customer support?',
    answer:
      'Our 24/7 customer support team is always ready to help. Contact us via email, phone, or live chat with any questions.',
  },
];

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Find answers to common questions about booking with TripNest
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <Accordion items={faqs} />
          </div>

          <div className="text-center mt-12">
            <HelpCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our support team is here to help you 24/7
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
