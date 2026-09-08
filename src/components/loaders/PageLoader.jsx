import React from 'react';
import { Plane } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/30" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <Plane className="absolute inset-0 m-auto w-6 h-6 text-primary-500 animate-pulse" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/30" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        <Plane className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
      </div>
    </div>
  );
}
