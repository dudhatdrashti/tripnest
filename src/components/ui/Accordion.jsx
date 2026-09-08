import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items = [], allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggle = (index) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isOpen = (index) => openIndexes.includes(index);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggle(index)}
            className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="font-medium">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen(index) ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {isOpen(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
