import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Real, always-available travel cinematic video (YouTube embed — never shows "Unable to load")
const VIDEO_ID = 'LXb3EKWsInQ';

export default function VideoModal({ open, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  // Lock body scroll when opened
  useEffect(() => {
    if (open) {
      setLoaded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={t('ui.travelVideo')}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Modal Panel */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-4xl"
          >
            {/* Glass frame */}
            <div className="relative rounded-3xl glass-card-dark border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Video aspect wrapper */}
              <div className="relative aspect-video bg-black">
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
                    <p className="text-white/70 text-sm mt-3">{t('ui.loadingVideo')}</p>
                  </div>
                )}
                <iframe
                  key={VIDEO_ID}
                  title={t('ui.travelVideo')}
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                />
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all"
                aria-label={t('ui.closeVideo')}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
