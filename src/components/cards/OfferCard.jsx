import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function OfferCard({ offer, index = 0 }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast.success(t('ui.promoCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative group overflow-hidden rounded-2xl"
    >
      <div className="relative h-48">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">-{offer.discount}% OFF</span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-1">{offer.title}</h3>
        <p className="text-white/80 text-sm mb-3">{offer.description}</p>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Use Code: {offer.code}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
