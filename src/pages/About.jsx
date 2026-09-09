import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Globe,
  Shield,
  Heart,
  Award,
  Users,
  Rocket,
  Sparkles,
  Target,
  Eye,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const values = [
  {
    icon: Heart,
    title: 'about.customerFirst',
    description: 'about.customerFirstText',
  },
  {
    icon: Shield,
    title: 'about.trustSafety',
    description: 'about.trustSafetyText',
  },
  {
    icon: Sparkles,
    title: 'about.curatedExcellence',
    description: 'about.curatedExcellenceText',
  },
  {
    icon: Globe,
    title: 'about.globalReach',
    description: 'about.globalReachText',
  },
];

const stats = [
  { icon: Users, value: '500K+', label: 'about.happyTravelers' },
  { icon: Globe, value: '195+', label: 'about.countries' },
  { icon: Award, value: '15K+', label: 'about.hotels' },
  { icon: Rocket, value: '10+', label: 'about.years' },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            {t('about.story')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 leading-relaxed"
          >
            {t('about.storyText')}
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('ui.ourMission')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.missionText')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-accent-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('ui.ourVision')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.visionText')}
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-500 text-sm">{t(stat.label)}</div>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <div>
            <h2 className="text-4xl font-bold gradient-text text-center mb-12">{t('ui.ourValues')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t(value.title)}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {t(value.description)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('ui.readyToTravel')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('about.ctaText')}
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              {t('common.showMore')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
