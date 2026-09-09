import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Breadcrumb({ items = [], onLight = false, className = '' }) {
  const { t } = useTranslation();
  return (
    <nav
      className={`flex items-center gap-1 text-sm mb-4 ${
        onLight ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
      } ${className}`}
      aria-label={t('ui.breadcrumb')}
    >
      <Link
        to="/"
        className={`flex items-center gap-1 transition-colors ${
          onLight ? 'hover:text-white' : 'hover:text-primary-500'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">{t('ui.home')}</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.path ? (
            <Link
              to={item.path}
              className={`transition-colors ${
                onLight ? 'hover:text-white' : 'hover:text-primary-500'
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`font-medium ${
                onLight ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
