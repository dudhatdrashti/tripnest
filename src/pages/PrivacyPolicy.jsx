import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const sections = [
  {
    icon: Shield,
    title: 'ui.privacyCollectTitle', content: 'ui.privacyCollectText',
  },
  {
    icon: Lock,
    title: 'ui.privacyUseTitle', content: 'ui.privacyUseText',
  },
  {
    icon: Eye,
    title: 'ui.privacySharingTitle', content: 'ui.privacySharingText',
  },
  {
    icon: Shield,
    title: 'ui.privacySecurityTitle', content: 'ui.privacySecurityText',
  },
  {
    icon: Lock,
    title: 'ui.privacyRightsTitle', content: 'ui.privacyRightsText',
  },
  {
    icon: Eye,
    title: 'ui.privacyCookiesTitle', content: 'ui.privacyCookiesText',
  },
];

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t('ui.privacyTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80"
          >
            {t('ui.lastUpdated')}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold">{t(section.title)}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(section.content)}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            {t('ui.privacyContact')}{' '}
            <a href="mailto:privacy@tripnest.com" className="text-primary-500 hover:text-primary-600">
              privacy@tripnest.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
