import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Wallet,
  Calendar,
  Heart,
  Plane,
  Hotel,
  UtensilsCrossed,
  Camera,
  Lightbulb,
  Wand2,
  Loader2,
  Download,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const interestsList = [
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'photography', label: 'Photography', icon: '📸' },
];

const budgetRanges = [
  { id: 'budget', label: 'Budget', range: '$500 - $1000', icon: '💰' },
  { id: 'mid', label: 'Mid Range', range: '$1000 - $3000', icon: '💳' },
  { id: 'luxury', label: 'Luxury', range: '$3000+', icon: '💎' },
];

const hotels = ['Grand Plaza Hotel', 'Ocean View Resort', 'City Center Suites', 'Boutique Heritage Inn'];
const restaurants = ['Local Bistro', 'Street Food Tour', 'Fine Dining Experience', 'Cafe Culture'];
const activities = ['City Walking Tour', 'Museum Visit', 'Sunset Cruise', 'Cultural Show', 'Adventure Park', 'Photography Walk'];

const generateItinerary = (destination, budget, days, interests) => {
  const usedHotels = [];
  const usedRestaurants = [];
  const usedActivities = [];

  const pickRandom = (arr, used) => {
    let item;
    do {
      item = arr[Math.floor(Math.random() * arr.length)];
    } while (used.includes(item));
    used.push(item);
    return item;
  };

  const daysPlan = [];
  for (let i = 1; i <= days; i++) {
    const dayActivities = [];
    const count = interests.length >= 3 ? 3 : 2;
    for (let j = 0; j < count; j++) {
      dayActivities.push({
        time: j === 0 ? 'Morning' : j === 1 ? 'Afternoon' : 'Evening',
        title: pickRandom(activities, usedActivities),
        description: `Experience the best of ${destination} with this curated activity.`,
      });
    }
    daysPlan.push({
      day: i,
      hotel: i === 1 ? pickRandom(hotels, usedHotels) : usedHotels[0],
      restaurants: [pickRandom(restaurants, usedRestaurants)],
      activities: dayActivities,
    });
  }

  return {
    destination,
    budget: budgetRanges.find((b) => b.id === budget),
    days,
    interests: interestsList.filter((i) => interests.includes(i.id)),
    daysPlan,
    tips: [
      `Book your flights to ${destination} at least 3 weeks in advance for the best prices.`,
      `Pack light and use public transport to save on travel costs.`,
      `Learn a few local phrases - locals appreciate the effort!`,
      `Visit popular attractions early morning to avoid crowds.`,
      `Try local street food for authentic and affordable dining experiences.`,
    ],
  };
};

export default function TripPlanner() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('mid');
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [generating, setGenerating] = useState(false);

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }
    if (interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setItinerary(generateItinerary(destination, budget, days, interests));
      setGenerating(false);
      setStep(3);
      toast.success('Your itinerary is ready!');
    }, 2000);
  };

  const handleReset = () => {
    setStep(1);
    setDestination('');
    setBudget('mid');
    setDays(3);
    setInterests([]);
    setItinerary(null);
  };

  const handleDownload = () => {
    toast.success('Itinerary exported! (Demo)');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">AI Powered</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            AI Trip Planner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Create your perfect personalized travel itinerary in seconds
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 rounded-full ${step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Destination */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow"
              >
                <h2 className="text-2xl font-bold mb-6">Where are you going?</h2>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter your dream destination (e.g., Bali, Paris, Tokyo)"
                    className="input-field pl-12"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Paris', 'Bali', 'Tokyo', 'Dubai', 'Rome', 'Barcelona'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDestination(d)}
                      className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <Button variant="primary" size="lg" className="w-full" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Budget, Days, Interests */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow"
              >
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Wallet className="w-5 h-5 text-primary-500" />
                    What's your budget?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {budgetRanges.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          budget === b.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-2xl mb-2">{b.icon}</div>
                        <div className="font-semibold">{b.label}</div>
                        <div className="text-sm text-gray-500">{b.range}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    How many days?
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDays(Math.max(1, days - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-2xl hover:border-primary-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-4xl font-bold gradient-text">{days}</span>
                    <button
                      onClick={() => setDays(Math.min(14, days + 1))}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-2xl hover:border-primary-500 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-gray-500">days</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Heart className="w-5 h-5 text-primary-500" />
                    What are you interested in?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {interestsList.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          interests.includes(interest.id)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-2xl mb-1">{interest.icon}</div>
                        <div className="font-medium text-sm">{interest.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" className="flex-1" onClick={handleGenerate} loading={generating}>
                    {generating ? 'Generating...' : 'Generate Itinerary'}
                    {!generating && <Wand2 className="w-4 h-4" />}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Itinerary */}
            {step === 3 && itinerary && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-bold gradient-text mb-2">
                        Your {itinerary.destination} Adventure
                      </h2>
                      <p className="text-gray-500">
                        {itinerary.days} days · {itinerary.budget.label} budget ·{' '}
                        {itinerary.interests.map((i) => i.label).join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={handleReset} icon={Lightbulb}>
                        New Trip
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleDownload} icon={Download}>
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Itinerary Days */}
                  <div className="space-y-6">
                    {itinerary.daysPlan.map((dayPlan) => (
                      <motion.div
                        key={dayPlan.day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayPlan.day * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center font-bold text-primary-500">
                            {dayPlan.day}
                          </div>
                          <h3 className="text-xl font-semibold">Day {dayPlan.day}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 font-medium mb-2">
                              <Hotel className="w-4 h-4 text-primary-500" />
                              Stay
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{dayPlan.hotel}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 font-medium mb-2">
                              <UtensilsCrossed className="w-4 h-4 text-primary-500" />
                              Dining
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{dayPlan.restaurants[0]}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 font-medium mb-2">
                              <Plane className="w-4 h-4 text-primary-500" />
                              Activities
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {dayPlan.activities.map((a) => a.title).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          {dayPlan.activities.map((activity, index) => (
                            <div key={index} className="flex gap-3 items-start">
                              <div className="w-20 text-xs font-medium text-primary-500 pt-0.5">
                                {activity.time}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Travel Tips */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
                  <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Travel Tips
                  </h3>
                  <div className="space-y-3">
                    {itinerary.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Camera className="w-4 h-4 text-primary-500 mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
