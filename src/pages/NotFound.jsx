import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-8xl md:text-9xl font-bold gradient-text leading-none">
            404
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{t('ui.pageNotFound')}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            {t('ui.notFoundDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              <Home className="w-4 h-4" />
              {t('ui.backToHome')}
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <Search className="w-4 h-4" />
              {t('ui.searchHotels')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
