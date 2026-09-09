import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/ui/Accordion';

const faqs = [
  {
    question: 'faq.bookQuestion',
    answer:
      'faq.bookAnswer',
  },
  {
    question: 'faq.cancelQuestion',
    answer:
      'faq.cancelAnswer',
  },
  {
    question: 'faq.paymentQuestion',
    answer:
      'faq.paymentAnswer',
  },
  {
    question: 'faq.receiptQuestion',
    answer:
      'faq.receiptAnswer',
  },
  {
    question: 'faq.promoQuestion',
    answer:
      'faq.promoAnswer',
  },
  {
    question: 'faq.plannerQuestion',
    answer:
      'faq.plannerAnswer',
  },
  {
    question: 'faq.securityQuestion',
    answer:
      'faq.securityAnswer',
  },
  {
    question: 'faq.supportQuestion',
    answer:
      'faq.supportAnswer',
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
            {t('faq.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            {t('faq.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <Accordion items={faqs.map((item) => ({ question: t(item.question), answer: t(item.answer) }))} />
          </div>

          <div className="text-center mt-12">
            <HelpCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('ui.stillQuestions')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('faq.supportText')}
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
            >
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
