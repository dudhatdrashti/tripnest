import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Minimize2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const WIDGET_KEY = 'tripnest_chat_position';

const QUICK_REPLIES = [
  { label: 'chat.findHotels', icon: '🏨' },
  { label: 'chat.planTrip', icon: '✈️' },
  { label: 'chat.bestDestinations', icon: '🌍' },
  { label: 'chat.travelTips', icon: '💡' },
];

function getBotReply(message, isAuthenticated, userName) {
  const text = message.toLowerCase();
  const name = isAuthenticated ? userName || 'there' : 'there';

  if (text.includes('hotel') || text.includes('stay') || text.includes('room')) {
    return `Great choice, ${name}! 🏨 I can help you find the perfect hotel. Try searching on the Search bar or check the Hotels page for our luxury collection. Would you like help with a specific destination?`;
  }
  if (text.includes('destination') || text.includes('place') || text.includes('go')) {
    return `We have amazing destinations, ${name}! 🌍 From beach escapes in Goa to mountain retreats in the Alps, and city breaks in Paris. Check the Destinations page to explore more!`;
  }
  if (text.includes('plan') || text.includes('trip') || text.includes('itinerary')) {
    return `I'd love to help you plan your trip, ${name}! ✈️ Visit our AI Trip Planner where you can enter your destination, budget, days, and interests to get a personalized itinerary.`;
  }
  if (text.includes('price') || text.includes('cost') || text.includes('budget')) {
    return `We offer competitive prices across all budgets, ${name}! You can filter by price on the search results page and catch exclusive deals on our Deals page. 💰`;
  }
  if (text.includes('book') || text.includes('reserve')) {
    return `Booking is super easy, ${name}! Just click "Book Now" on any hotel, fill in your details, and confirm. You'll get an instant confirmation and downloadable receipt. ✅`;
  }
  if (text.includes('tip') || text.includes('advice') || text.includes('suggest')) {
    return `Here's a travel tip, ${name}! 💡 Always compare prices across currencies, check reviews, and book in advance for the best deals. Also, turning on notifications helps you catch price drops!`;
  }
  if (text.includes('discount') || text.includes('offer') || text.includes('deal')) {
    return `We've got some amazing offers right now, ${name} 🎉! Check the Special Offers section on our home page and the Deals page for exclusive discounts. Don't forget to apply promo codes at checkout!`;
  }
  if (text.includes('help') || text.includes('hello') || text.includes('hi')) {
    return `Hello ${name}! 👋 I'm Nestie, your TripNest travel assistant. I can help you find hotels, plan trips, discover destinations, and find great deals. What would you like help with?`;
  }
  return `Thanks for your message, ${name}! 🤖 I'm still learning, but I can help with hotel bookings, trip planning, destinations, deals, and travel tips. Try asking about "hotels", "trip planning", or "best destinations"!`;
}

export default function ChatWidget() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m Nestie 🤖 — your TripNest travel assistant. Ready to plan your next adventure?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WIDGET_KEY));
      return saved || { x: null, y: null };
    } catch {
      return { x: null, y: null };
    }
  });

  const dragRef = useRef(null);
  const bodyRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const savePosition = (x, y) => {
    try {
      localStorage.setItem(WIDGET_KEY, JSON.stringify({ x, y }));
    } catch {
      /* ignore */
    }
  };

  const handleSend = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: getBotReply(msg, isAuthenticated, user?.name) },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        drag
        dragMomentum={false}
        dragConstraints={false}
        dragElastic={0.1}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDragEnd={(e, info) => {
          setTimeout(() => {
            isDragging.current = false;
          }, 100);
          const newX = info.point.x;
          const newY = info.point.y;
          setPosition({ x: newX, y: newY });
          savePosition(newX, newY);
        }}
        initial={{ x: position.x ?? null, y: position.y ?? null }}
        animate={!position.x && position.x !== 0 ? { x: 0, y: 0 } : {}}
        onClick={() => {
          if (!isDragging.current) setOpen(true);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/40 cursor-grab active:cursor-grabbing"
        aria-label={t('chat.open')}
        style={{ x: position.x && position.x !== 0 ? position.x : 0, y: position.y && position.y !== 0 ? position.y : 0 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[60] w-[370px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] flex flex-col rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/20"
          >
            {/* Header */}
            <div className="relative p-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{t('ui.aiAssistant')}</div>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-300" />
                  Online · {isAuthenticated ? `Hi ${user?.name?.split(' ')[0] || 'there'}` : 'Guest mode'}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={t('chat.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.role === 'bot' && (
                      <div className="mb-1 flex items-center gap-1.5 text-primary-500 dark:text-primary-400 text-xs font-medium">
                        <Bot className="w-3.5 h-3.5" />
                        Nestie
                      </div>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-3 pt-2 flex gap-2 overflow-x-auto pb-1 bg-gray-50/50 dark:bg-gray-900/50">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleSend(t(qr.label))}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center gap-1.5"
                >
                  <span>{qr.icon}</span>
                  {t(qr.label)}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  aria-label={t('chat.message')}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-60"
                  disabled={!input.trim()}
                  aria-label={t('chat.send')}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
